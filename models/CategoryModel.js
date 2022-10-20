const mongoose = require('mongoose');
// const slugify = require('slugify');
// const Schema = mongoose.Schema;

const CategorySchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    // slug: {
    //     type: String,
    //     unique: true
    // }

}, {timestamps: true})

// CategorySchema.pre('validate',function(next){
//     this.slug = slugify(this.name,{
//         lower:true,
//         strict:true
//     })
//     next();
// })

module.exports = mongoose.model("CategoryStore",CategorySchema);

// module.exports = mongoose.model("CategoryStore", CategorySchema);