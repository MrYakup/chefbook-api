const jwt = require("jsonwebtoken");
const BlogStore = require("../models/BlogModel");
const RecipeStore = require("../models/RecipeModel");
const UserStore = require("../models/UserModel");


const dashSavedRecipes = async (req, res) => {
    const cookies =  req.cookies
    if (!cookies?.jwt) return res.status(401).json({ message: 'create recipe Unauthorized' })
    const token = await cookies.jwt
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    try {
        const user = await UserStore.findById(decoded.id).populate('recipes');
        // console.log("saved recipes verileri çekildi")
        const savedRecipes = await RecipeStore.find({_id: user.recipes}).populate("user").then((savedRecipe) => res.json(savedRecipe));
    } catch (error) {
        console.log("saved Recipes hatası")
    }

}

const dashBlogs = async (req, res) => {
    const cookies =  req.cookies
    if (!cookies?.jwt) return res.status(401).json({ message: 'dash blogs Unauthorized' })
    const token = await cookies.jwt
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    try {
        const me = await UserStore.findById(decoded.id)
        const myFollowings =  me.followings;
        const dashBlogs = await BlogStore.find({user: myFollowings}).populate("user","-password")
        // const contentRecipes = await RecipeStore.find({user: myFollowings})
        res.status(200).json({ succeded: true, dashBlogs })
    } catch (error) {
        console.log("hatalı dashBlogs isteği")
    }
}

const dashRecipes = async (req, res) => {
    const cookies =  req.cookies
    if (!cookies?.jwt) return res.status(401).json({ message: 'dash recipes Unauthorized' })
    const token = await cookies.jwt
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    try {
        const me = await UserStore.findById(decoded.id)
        const myFollowings =  me.followings;
        const dashRecipes = await RecipeStore.find({user: myFollowings}).populate("user","-password")
        // const contentRecipes = await RecipeStore.find({user: myFollowings})
        res.status(200).json({ succeded: true, dashRecipes })
    } catch (error) {
        console.log("hatalı dashRecipes isteği")
    }
}



exports.dashSavedRecipes = dashSavedRecipes;
exports.dashBlogs = dashBlogs;
exports.dashRecipes = dashRecipes;