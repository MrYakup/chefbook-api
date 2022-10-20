const CategoryStore = require("../models/CategoryModel");


const newCategory = async (req, res, next) => {
    try {
        const newcategorie = new CategoryStore({
          name: req.body.name,
        });
    
        const categorie = await newcategorie.save();
        res.status(200).json(categorie);
      } catch (error) {
        console.log(error);
      }
}

const categories =  (req, res, next) => {
    Category.find().then((categories) => res.json(categories));
}


exports.newCategory = newCategory;
exports.categories = categories;