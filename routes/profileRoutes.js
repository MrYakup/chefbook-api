const express = require("express");
const { getProfileUser, follow, unfollow, getProfileBlogs, getProfileRecipes } = require("../controllers/profileController");


const profileRouter = express.Router();


profileRouter.get("/blogger/:id",  getProfileUser);
profileRouter.get("/blogger/blogs/:id", getProfileBlogs);
profileRouter.get("/blogger/recipes/:id", getProfileRecipes);
profileRouter.put("/:id/follow", follow);
profileRouter.put("/:id/unfollow", unfollow);


module.exports = profileRouter;
