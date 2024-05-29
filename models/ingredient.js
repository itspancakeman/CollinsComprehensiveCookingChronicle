const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    avgWeight: {type: Number},
    flavor: {type: String, required: true},
    edibleRaw: {type: Boolean, required: true},
    origin: {type: String},
    color: {type: String, required: true},
    scientificName: {type: String, required: true, unique: true}
});

const Ingredient = mongoose.model('Ingredient', ingredientSchema);

module.exports = Ingredient;