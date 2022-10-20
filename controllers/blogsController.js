const BlogStore = require('../models/BlogModel')
const UserStore = require('../models/UserModel')
const jwt = require('jsonwebtoken')

// @desc Get all blogs 
// @route GET /blogs
// @access Private
const getAllBlogs = async (req, res) => {
    // Get all blogs from MongoDB
    const blogs = await BlogStore.find().populate("user","-password")

    // If no blogs 
    if (!blogs?.length) {
        return res.status(400).json({ message: 'No blogs found' })
    }

    // Add username to each note before sending the response
    // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE
    // You could also do this with a for...of loop

    // const blogsWithUser = await Promise.all(blogs.map(async (blog) => {
    //     const user = await UserStore.findById(blog.user).lean().exec()
    //     return { ...blog, username: user.username }
    // }))

    res.json(blogs)
}

// @desc Create new blog
// @route POST /blogs
// @access Private
const createNewBlog = async (req, res) => {
    const cookies =  req.cookies
    if (!cookies?.jwt) return res.status(401).json({ message: 'create blog Unauthorized' })
    const token = await cookies.jwt
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    // console.log("decoded",decoded)
    const { title, content, image } = req.body
    // Confirm data
    if (!title || !content || !image) {
        return res.status(400).json({ message: 'All fields are required' })
    }   

    // Create and store the new user 
    const blog = await BlogStore.create({ title, content, image, user:decoded.id })

    if (blog) { // Created 
        return res.status(201).json({ message: 'New blog created',cookies })
    } else {
        return res.status(400).json({ message: 'Invalid blog data received' })
    }

}

// @desc Update a blog
// @route PATCH /blogs
// @access Private
const updateBlog = async (req, res) => {
    const { id, title, content, image } = req.body

    // Confirm data
    if (!id || !title || !content || !image) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Confirm blog exists to update
    const blog = await BlogStore.findById(id).exec()

    if (!blog) {
        return res.status(400).json({ message: 'Blog not found' })
    }

    blog.title = title
    blog.content = content
    blog.image = image

    const updatedBlog = await blog.save()

    res.json(`'${updatedBlog.title}' updated`)
}

// @desc Delete a blog
// @route DELETE /blogs
// @access Private
const deleteBlog = async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Blog ID required' })
    }

    // Confirm note exists to delete 
    const blog = await BlogStore.findById(id).exec()

    if (!blog) {
        return res.status(400).json({ message: 'Blog not found' })
    }

    const result = await blog.deleteOne()

    const reply = `Blog '${result.title}' with ID ${result._id} deleted`

    res.json(reply)
}

module.exports = {
    getAllBlogs,
    createNewBlog,
    updateBlog,
    deleteBlog
}