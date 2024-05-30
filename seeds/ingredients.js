const { Ingredient } = require('../models');

Ingredient.create({
    name: 'Garlic',
    avgWeight: 0.13,
    flavor: 'Soft, Sweet, and Buttery (cooked)',
    edibleRaw: true,
    origin: 'West China',
    color: 'White',
    scientificName: 'Allium sativum'
})
.then(ingredient => {
    console.log('----new ingredient----\n', ingredient);
})
.catch(error => {
    console.log('----error creating ingredient----\n', error);
});