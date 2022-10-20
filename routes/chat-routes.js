const express = require("express");
const { allUsers, accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup } = require("../controllers/chat-controller");
const { sendMessage, allMessages } = require("../controllers/message-controller");


const chatRouter = express.Router();

//chat routes
chatRouter.post("/chat", accessChat);
chatRouter.get("/chat", fetchChats);
chatRouter.post("/chat/group", createGroupChat);
chatRouter.put("/chat/rename", renameGroup);
chatRouter.put("/chat/groupadd", addToGroup);
chatRouter.put("/chat/groupremove", removeFromGroup);

//user route
chatRouter.get("/users",  allUsers);

//message routes
chatRouter.post("/message", sendMessage)
chatRouter.get("/message/:chatId", allMessages)


module.exports = chatRouter;
