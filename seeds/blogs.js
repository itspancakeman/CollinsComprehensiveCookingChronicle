const { Blog } = require('../models');

Blog.create({
    title: "How to roast vegetables - a beginner's guide",
    id: 1,
    postedWhen: 'June 1, 2024',
    postedBy: 'Collin St-Onge',
    content: {
        section1: "Roasting vegetables is simple and easy! They make for a great side or a wonderful addition to your main course. When it comes to planning dinner, roasting vegetables can be a valuable tool.\n Now let's talk specifics, your first choice will which vegetable you'd like to roast! Really any vegetable is a great choice it's all about your personal preference and what you'd like to use these vegetables for.\n Now that you've selected a vegetable, go ahead and choose a platform for roasting that is accessible to you, popular options include in the oven, over an open flame, or via an alternative heat source.\n Once you have selected your preferred tool for roasting, we'll want to determine how long your vegetables should be roasted. Each type will be different, so let's discuss what 'done' looks like when roasting.\n 'Done' in this context will mean enhanced flavor through caramelization and browning, signs to look for will be changes in color, smell, and taste! Vegetables with thicker bodies typically take longer to roast, but anything can be cut to size to reduce cooking time or align it with other items.",
        section2: "Before roasting your vegetables it's important to toss them in an oil of your choosing and season to your taste. Oil helps prevent whatever it is you're roasting from burning, it also helps seasoning to stick, and will heat items more evenly through. Seasoning is also important for flavor, but can be skipped if your recipe has seasoning steps in other places.\n So what can we do with these roasted vegetables really? Now that we've enhanced the flavors we can eat them however we please! As I said at the start, roasted vegetables can make an excellent, low-effort side dish, being server exactly as is when they come out of the oven(after maybe some draining on a towel to get rid of excess oil if there is any). Roasted veggies are also a great addition to a developing main dish that you may be workshopping for dinner this evening. If you're in the brainstorming phase, considering adding roasted vegetables to rice, pasta, legumes, or other high-carb foods alongside a sauce for an ultimately satisfying meal that is also nutricious!\n Outside of what we talked about at the start, roasted vegetables can also be turned into sauces if you have a blender! Just add whatever veggies you've finished roasting to the blender with some liquid, such as water, vegetable stock, or meat-based broths. If you want a creamier sauce, try adding in heavy cream, coconut cream, or yogurt!\n We've covered a lot in this article, but remember that this SIMPLE method can be used in more COMPLEX ways to enhance dinner time. Start simple and build from there. As you start to get more comfortable with the technique, more complex ideas will start to formulate for you."
    },
    relatedImages: {
        image1: 'https://www.chelseasmessyapron.com/wp-content/uploads/2022/10/ROASTED-VEGETABLES-2.jpeg',
        image2: 'https://www.cookingclassy.com/wp-content/uploads/2018/12/roasted-vegetables-4.jpg'
    }
})
.then(blog => {
    console.log('----new blog post----\n', blog);
})
.catch(error => {
    console.log('----error creating blog post----\n', error);
});