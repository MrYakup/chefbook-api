const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 4,
    },
    image: {
      type: String,
      default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    },
    birthday: {
      type: String,
    },
    country: {
      type: {},
    },
    roles: {
      type: [String],
      default: ["Blogger"],
    },
    active: {
      type: Boolean,
      default: true,
    },
    recipes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RecipeStore",
      },
    ],
    blogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BlogStore",
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserStore",
      },
    ],
    followings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserStore",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserStore", userSchema);
