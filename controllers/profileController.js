const BlogStore = require("../models/BlogModel");
const RecipeStore = require("../models/RecipeModel");
const UserStore = require("../models/UserModel");
const jwt = require('jsonwebtoken')

const getProfileUser = async (req, res) => {
  const profileId = await req.params.id;
  // const cookies = await req.headers.cookie;
  const cookies =  req.cookies
  if (!cookies?.jwt) return res.status(401).json({ message: 'get userProfile Unauthorized' })
  const token = await cookies.jwt
  const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  console.log(profileId)
  try {
    if (!decoded || decoded === "undefined" || !profileId || profileId === "undefined" ) {
      return console.log("getProfilUser hatası 1");
    }
    // console.log(profileId)
    // const myId = await cookies.split("=")[0];
    const userInfo = await UserStore.findById(profileId,"-password") //.populate(['recipes','followers','followings']);
    if (!userInfo) {
      return res.status(404).json({ message: "User Not Found" });
    }
    const inFollowers = userInfo.followers.some((follower) => {
      return follower.equals(decoded.id);
    });
    const userBlogsLength = await BlogStore.find({ user: profileId })
    const userRecipesLength = await RecipeStore.find({ user: profileId })
    const blogLength =  userBlogsLength.length;
    const recipeLength =  userRecipesLength.length;
    const contentLength =  blogLength + recipeLength;

    return res.status(200).json({ userInfo, inFollowers, contentLength });
  } catch (error) {
    console.log("getProfileUser hatası 2");
  }
};

const getProfileBlogs = async (req, res) => {
  const profileId = await req.params.id;
  console.log("profileId", profileId)
  try {
    const profileBlogs = await BlogStore.find({ user: profileId }).then(
      (profileBlogs) => res.json(profileBlogs)
    ).catch(err => console.log("blogerr",err))
    // const profileRecipes = await RecipeStore.find({ user: profileId }).then(
    //   (profileRecipes) => res.json(profileRecipes)
    // ).catch(err => console.log("recipeerr",err))
  } catch (error) {
    console.log("getProfileBlogs hatası");
  }
};

const follow = async (req, res) => {
  const cookies =  req.cookies
  if (!cookies?.jwt) return res.status(401).json({ message: 'get userProfile Unauthorized' })
  const token = await cookies.jwt
  const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
// console.log("reeeq", req.params.id)
// console.log("decod", decoded.id)
  try {
      if(decoded.id === req.params.id){
          return res.send({message:"kendinizi takip edemezsiniz :)"})
      }
      let user = await UserStore.findByIdAndUpdate(
          {_id: req.params.id}, {$push: {followers: decoded.id } }, {new: true}
      )

      user = await UserStore.findByIdAndUpdate(
          {_id: decoded.id}, {$push: {followings: req.params.id } }, {new: true}
      )
      res.status(200).json({ succeded: true, user })
  } catch (error) {
      return console.log("follow hatası")
  }
}


const unfollow = async (req, res) => {
  const cookies =  req.cookies
  if (!cookies?.jwt) return res.status(401).json({ message: 'get userProfile Unauthorized' })
  const token = await cookies.jwt
  const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

  try {
      if(decoded.id === req.params.id){
          return console.log("kendini takip etmedinki çıkasın:)")
      }
      let user = await UserStore.findByIdAndUpdate(
          {_id: req.params.id}, {$pull: {followers: decoded.id } }, {new: true}
      )

      user = await UserStore.findByIdAndUpdate(
          {_id: decoded.id }, {$pull: {followings: req.params.id } }, {new: true}
      )
      res.status(200).json({ succeded: true, user })
  } catch (error) {
      return console.log("follow hatası")
  }
}

exports.getProfileUser = getProfileUser;
exports.getProfileBlogs = getProfileBlogs;
exports.follow = follow;
exports.unfollow = unfollow;
