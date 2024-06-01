const { Recipe } = require('../models');

Recipe.create({
    name: 'Blackberry-Cherry Cobbler with Honey Whipped Cream',
    id: 1,
    prepTime: '1.5 hours',
    cookTime: '40 minutes',
    totalTime: '2 hours 10 minutes',
    servings: 8,
    ingredients: {
        filling: {
            blackberries: '2lbs or 3.5 cups',
            cherries: '1lb or 2 cups',
            sugar: '1/2 cup',
            APFlour: '3 tablespoons',
            lemonJuice: '2 tablespoons',
            marjoram: '1 tablespoon',
            vanillaExtract: '1 teaspoon',
            cinnamon: '0.5 teaspoon',
            salt: '0.25 teaspoon'
        },
        biscuits: {
            APFlour: '2 cups',
            bakingPowder: '2 teaspoons',
            salt: '1 teaspoon',
            sugar: '1 tablespoon',
            unsaltedButter: '0.5 cup, chilled and cut into pieces',
            buttermilk: '0.75 cup',
            eggs: '1 large, beaten'
        },
        topping: {
            heavyCream: '0.5 cup',
            sourCream: '0.5 cup',
            honey: '1 tablespoon',
            sugar: '1 tablespoon'
        }
    },
    directions: {
        step1: 'Heat oven to 350 degrees. Toss blackberries, cherries, sugar, flour, lemon juice, marjoram, vanilla, cinammon, and salt in a large bowl. Transfer to a shallow, 3qt baking dish.',
        step2: 'Pulse the flour, baking powder, salt, and sugar in a food processor or blender to combine. add butter and pulse until the texture reaches a course meal. Transfer the micture to a large bowl, mix in the buttermilk, and gently knead a few times before dropping mounds of biscuit over the filling. Brush with egg, and sprinkle with more sugar.',
        step3: 'Place cobbler on a baking sheet and bake, tenting with foil if the topping becomes too dark before filling finishes. Filling will be bibbling and topping will be golden brown when finished, 35-40 minutes. Transfer to a wire rack to cool slightly.',
        step4: 'Just before serving, whisk the heavy cream, sour cream, honey, and powdered sugar in a medium bowl until soft peaks form.',
        step5: 'Serve cobbler topped with whipped cream mixture.'
    },
    submittedBy: 'Collin St-Onge'
})
.then(recipe => {
    console.log('----new recipe----\n', recipe);
})
.catch(error => {
    console.log('----error creating recipe----\n', error);
});