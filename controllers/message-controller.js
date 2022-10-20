const UserStore = require("../models/UserModel");
const ChatStore = require("../models/ChatModel");
const MessageStore = require("../models/MessageModel");
const jwt = require('jsonwebtoken')

const sendMessage = async (req, res) => {
  const cookies =  req.cookies
  if (!cookies?.jwt) return res.status(401).json({ message: 'accessChat Unauthorized' })
  const token = await cookies.jwt
  const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

  const { content, chatId } = await req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  let newMessage = {
    sender: decoded.id,
    content: content,
    chat: chatId,
  };

  try {
    let message = await MessageStore.create(newMessage);

    message = await message.populate("sender", "name image");
    message = await message.populate("chat");
    message = await UserStore.populate(message, {
      path: "chat.users",
      select: "name image email",
    });

    await ChatStore.findByIdAndUpdate(
      req.body.chatId,
      {
        latestMessage: message,
      },
      {
        new: true,
      }
    );

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

const allMessages = async (req, res) => {
  try {
    const messages = await MessageStore.find({ chat: req.params.chatId })
      .populate("sender", "name image email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

exports.sendMessage = sendMessage;
exports.allMessages = allMessages;
