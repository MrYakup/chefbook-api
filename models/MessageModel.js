const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserStore",
    },
    content: {
      type: String,
      trim: true,
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatStore",
    },
    // readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserStore", }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("MessageStore", MessageSchema);
