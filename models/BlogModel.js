const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2')

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'UserStore'
    }

}, {timestamps: true})

blogSchema.plugin(mongoosePaginate)
module.exports = mongoose.model("BlogStore", blogSchema);