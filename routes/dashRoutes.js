const express = require("express");
const { dashSavedRecipes, dashBlogs, dashRecipes } = require("../controllers/dashController");


const dashRouter = express.Router();


dashRouter.get("/savedrecipes", dashSavedRecipes);
dashRouter.get("/blogs", dashBlogs);
dashRouter.get("/recipes", dashRecipes);


module.exports = dashRouter;
