const express = require('express')
const router = express.Router()
const recipesController = require('../controllers/recipesController')
// const verifyJWT = require('../middleware/verifyJWT')

// router.use(verifyJWT)

router.route('/')
    .get(recipesController.getAllRecipes)
    .post(recipesController.createNewRecipe)
    .patch(recipesController.updateRecipe)
    .delete(recipesController.deleteRecipe)
router.route('/addRecipe/:id').post(recipesController.addRecipeToProfile)    
router.route('/removeRecipe/:id').post(recipesController.removeRecipeFromProfile)    

module.exports = router