const RecipeStore = require('../models/RecipeModel')
const UserStore = require('../models/UserModel')
const jwt = require('jsonwebtoken')

// @desc Get all recipes 
// @route GET /recipes
// @access Private
const getAllRecipes = async (req, res) => {
    // Get all recipes from MongoDB
    const recipes = await RecipeStore.find().populate("user","-password")

    // If no notes 
    if (!recipes?.length) {
        return res.status(400).json({ message: 'No recipes found' })
    }

    // Add username to each note before sending the response
    // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE
    // You could also do this with a for...of loop

    // const blogsWithUser = await Promise.all(blogs.map(async (blog) => {
    //     const user = await UserStore.findById(blog.user).lean().exec()
    //     return { ...blog, username: user.username }
    // }))

    res.json(recipes)
}

// @desc Create new recipe
// @route POST /recipes
// @access Private
const createNewRecipe = async (req, res) => {
    const cookies =  req.cookies
    if (!cookies?.jwt) return res.status(401).json({ message: 'create recipe Unauthorized' })
    const token = await cookies.jwt
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    // console.log("decoded",decoded)
    const { title, content, image, cookingtime, category } = req.body
    // Confirm data
    if (!title || !content || !image || !cookingtime || !category) {
        return res.status(400).json({ message: 'All fields are required' })
    }   

    // Create and store the new user 
    const recipe = await RecipeStore.create({ title, content, image, cookingtime, category, user:decoded.id })

    if (recipe) { // Created 
        return res.status(201).json({ message: 'New recipe created', cookies })
    } else {
        return res.status(400).json({ message: 'Invalid recipe data received' })
    }

}

// @desc Update a recipe
// @route PATCH /recipes
// @access Private
const updateRecipe = async (req, res) => {
    const { title, content, image, cookingtime, category } = req.body

    // Confirm data
    if (!title || !content || !image || !cookingtime || !category) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Confirm note exists to update
    const recipe = await RecipeStore.findById(id).exec()

    if (!recipe) {
        return res.status(400).json({ message: 'Recipe not found' })
    }

    recipe.title = title
    recipe.content = content
    recipe.image = image
    recipe.cookingtime = cookingtime
    recipe.category = category

    const updatedRecipe = await recipe.save()

    res.json(`'${updatedRecipe.title}' updated`)
}

// @desc Delete a recipe
// @route DELETE /recipes
// @access Private
const deleteRecipe = async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Recipe ID required' })
    }

    // Confirm recipe exists to delete 
    const recipe = await RecipeStore.findById(id).exec()

    if (!recipe) {
        return res.status(400).json({ message: 'Recipe not found' })
    }

    const result = await recipe.deleteOne()

    const reply = `Recipe '${result.title}' with ID ${result._id} deleted`

    res.json(reply)
}

const addRecipeToProfile = async (req, res) => {
    const cookies =  req.cookies
    if (!cookies?.jwt) return res.status(401).json({ message: 'addRecipeToProfile Unauthorized' })
    const token = await cookies.jwt
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const recipeId = await req.params.id;
    console.log("recipeId",recipeId)
    try {
      const user = await UserStore.findById(decoded.id).populate("recipes");
      user.recipes.push(recipeId);
      await user.save();
      res.status(200).json({message:"başarılı bir şekilde kaydedildi"});
      console.log("başaarılı kayıt")
    } catch (error) {
      console.log(error);
    }
  };
  
  const removeRecipeFromProfile = async (req, res) => {
    const cookies =  req.cookies
    if (!cookies?.jwt) return res.status(401).json({ message: 'removeRecipeFromProfile Unauthorized' })
    const token = await cookies.jwt
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const recipeId = await req.params.id;
    // const {id} = await req.body;
    // console.log("iddd", recipeId)
    try {
      const user = await UserStore.findById(decoded.id);
      user.recipes.pull({ _id: recipeId });
      await user.save();
      res.status(200).json({message:"başarılı bir şekilde silindi"});
    } catch (error) {
      console.log(error);
    }
  };

module.exports = {
    getAllRecipes,
    createNewRecipe,
    updateRecipe,
    deleteRecipe,
    addRecipeToProfile,
    removeRecipeFromProfile
}