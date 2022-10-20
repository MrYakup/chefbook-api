const UserStore = require("../models/UserModel");
const ChatStore = require("../models/ChatModel");
const jwt = require('jsonwebtoken')

//@description     Create or fetch One to One Chat
//@route           POST /api/chat/
//@access          Protected
const accessChat = async (req, res) => {
  const cookies =  req.cookies
    if (!cookies?.jwt) return res.status(401).json({ message: 'accessChat Unauthorized' })
    const token = await cookies.jwt
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
// console.log("accessChatMyId",decoded.id)
  const { userId } = req.body;
  // console.log("accessChatUserId",userId)
  if (!userId) {
    console.log("userId param not sent with request");
    return res.sendStatus(400);
  }
  let isChat = await ChatStore.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: decoded.id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await UserStore.populate(isChat, {
    path: "latestMessage.sender",
    select: "name image email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    let chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [decoded.id, userId],
    };

    try {
      const createdChat = await ChatStore.create(chatData);
      const FullChat = await ChatStore.findOne({
        _id: createdChat._id,
      }).populate("users", "-password");
      res.status(200).send(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
};

//@description     Fetch all chats for a user
//@route           GET /api/chat/
//@access          Protected
const fetchChats = async (req, res) => {
  const cookies =  req.cookies
  if (!cookies?.jwt) return res.status(401).json({ message: 'accessChat Unauthorized' })
  const token = await cookies.jwt
  const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
console.log("fetchChats", decoded.id)
  try {
    ChatStore.find({ users: { $elemMatch: { $eq: decoded.id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await UserStore.populate(results, {
          path: "latestMessage.sender",
          select: "name image email",
        });

        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

//@description     Create New Group Chat
//@route           POST /api/chat/group
//@access          Protected
const createGroupChat = async (req, res) => {
  const cookies =  req.cookies
    if (!cookies?.jwt) return res.status(401).json({ message: 'accessChat Unauthorized' })
    const token = await cookies.jwt
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

  if (!req.body.users || !req.body.name) {
    return res.status(400).json({ message: "Please Fill all the feilds" });
  }

  let users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .json({ message: "More than 2 users are required to form a group chat" });
  }

  users.push(decoded.id);

  try {
    const groupChat = await ChatStore.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: decoded.id,
    });
    const fullGroupChat = await ChatStore.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res
      .status(200)
      .json({ message: "başarılı bir şekilde oluşturuldu", fullGroupChat });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

// @desc    Rename Group
// @route   PUT /api/chat/rename
// @access  Protected
const renameGroup = async (req, res) => {
  const { chatId, chatName } = await req.body;
  const updatedChat = await ChatStore.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404).json({ message: " renameGroup güncelleme hatası" });
    throw new Error("Chat Not Found");
  } else {
    res.status(200).json(updatedChat);
  }
};

// @desc    Add user to Group / Leave
// @route   PUT /api/chat/groupadd
// @access  Protected
const addToGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const added = await ChatStore.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(added);
  }
};

// @desc    Remove user from Group
// @route   PUT /api/chat/groupremove
// @access  Protected
const removeFromGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const removed = await ChatStore.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(removed);
  }
};

//@description     Get or Search all users
//@route           GET /api/users?search=
//@access          Public
const allUsers = async (req, res) => {
  const cookies =  req.cookies
  if (!cookies?.jwt) return res.status(401).json({ message: 'accessChat Unauthorized' })
  const token = await cookies.jwt
  const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

  const keyword = req.query.search
    ? // $or: [
      { name: { $regex: req.query.search, $options: "i" } }
    : // { email: { $regex: req.query.search, $options: "i" } },
      // ],
      {};

  const users = await UserStore.find(keyword).find({
    _id: { $ne: decoded.id },
  });

  res.send(users);
};

exports.accessChat = accessChat;
exports.fetchChats = fetchChats;
exports.createGroupChat = createGroupChat;
exports.renameGroup = renameGroup;
exports.addToGroup = addToGroup;
exports.removeFromGroup = removeFromGroup;
exports.allUsers = allUsers;
