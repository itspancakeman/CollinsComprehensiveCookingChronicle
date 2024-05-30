const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    name: {type: String, required: true},
    prepTime: {type: String, required: true},
    cookTime: {type: String, required: true},
    totalTime: {type: String, required: true},
    servings: {type: Number, required: true},
    ingredients: {type: Object, required: true},
    directions: {type: Object, required: true},
    submittedBy: {type: String, required: true}
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;