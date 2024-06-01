const { Recipe } = require('../models');

Recipe.create({
    name: 'Blackberry-Cherry Cobbler with Honey Whipped Cream',
    id: 1,
    prepTime: '1.5 hours',
    cookTime: '40 minutes',
    totalTime: '2 hours 10 minutes',
    servings: 8,
    ingredients: {
        item1: {
            ing1: 'blackberries - 2lbs or 3.5 cups',
            ing2: 'cherries - 1lb or 2 cups',
            ing3: 'sugar - 1/2 cup',
            ing4: 'APFlour - 3 tablespoons',
            ing5: 'lemonJuice - 2 tablespoons',
            ing6: 'marjoram - 1 tablespoon',
            ing7: 'vanillaExtract - 1 teaspoon',
            ing8: 'cinnamon - 0.5 teaspoon',
            ing9: 'salt - 0.25 teaspoon'
        },
        item2: {
            ing1: 'APFlour - 2 cups',
            ing2: 'bakingPowder - 2 teaspoons',
            ing3: 'salt - 1 teaspoon',
            ing4: 'sugar -1 tablespoon',
            ing5: 'unsaltedButter - 0.5 cup, chilled and cut into pieces',
            ing6: 'buttermilk - 0.75 cup',
            ing7: 'eggs - 1 large, beaten'
        },
        item3: {
            ing1: 'heavyCream - 0.5 cup',
            ing2: 'sourCream - 0.5 cup',
            ing3: 'honey - 1 tablespoon',
            ing4: 'sugar - 1 tablespoon'
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