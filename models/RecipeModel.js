const mongoose = require('mongoose');
// const slugify = require('slugify');
// const Schema = mongoose.Schema

const RecipeSchema = new mongoose.Schema({
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
    cookingtime: {
        type: String,
        required: true
    },
    video: {
        type: String,
        // required:true
    },
    calorie:{
        type:String,
        // required:true
    },
    totalfat:{
        type: String,
        // required:true
    },
    protein:{
        type: String,
        // required: true
    },
    carbohydrate:{
        type: String,
        // required: true
    },
    cholesterol:{
        type:String,
        // required: true
    },
    category:{
        type: mongoose.Schema.Types.ObjectId ,
         ref:'CategoryStore'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'UserStore'
    }
    // slug: {
    //     type: String,
    //     unique: true
    // }


}, {timestamps: true})

// RecipeSchema.pre('validate',function(next){
//     this.slug = slugify(this.title,{
//         lower:true,
//         strict:true
//     })
//     next();
// })

module.exports = mongoose.model("RecipeStore", RecipeSchema);