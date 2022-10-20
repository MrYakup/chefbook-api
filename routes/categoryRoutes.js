const express = require("express");
const { newCategory, categories } = require("../controllers/categoryController");



const categoryRouter = express.Router();

categoryRouter.post("/newcategory", newCategory);
categoryRouter.get("/", categories);


module.exports = categoryRouter;
