const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema(
  {
    chatName: {
      type: String,
      trim: true,
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserStore",
      },
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MessageStore",
    },
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserStore",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ChatStore", ChatSchema);
