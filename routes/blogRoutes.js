const express = require('express')
const router = express.Router()
const blogsController = require('../controllers/blogsController')
// const verifyJWT = require('../middleware/verifyJWT')

// router.use(verifyJWT)

router.route('/')
    .get(blogsController.getAllBlogs)
    .post(blogsController.createNewBlog)
    .patch(blogsController.updateBlog)
    .delete(blogsController.deleteBlog)

module.exports = router