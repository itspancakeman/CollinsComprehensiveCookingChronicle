// ===== GLOBAL VARIABLES =====
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const flash = require('connect-flash');
const session = require('express-session');
const PORT = process.env.PORT || 3000;
const passport = require('./config/passport-config');
const isLoggedIn = require('./middleware/isLoggedIn');
const SECRET_SESSION = process.env.SECRET_SESSION;
const { User } = require('./models');
const { Ingredient } = require('./models');
const { Recipe } = require('./models');
const { Blog } = require('./models');
// ====== MIDDLEWARE ====== 
app.set('view engine', 'ejs');
let urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.json())
app.use('/', express.static('public'));
app.use(session({
    secret: SECRET_SESSION,
    resave: false,
    saveUninitialized: true
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.alerts = req.flash();
    res.locals.currentUser = req.user;
    next();
});

// ---- import auth routes -----
app.use('/auth', require('./controllers/auth'));

// ===== POST ROUTES =====
// ------ NEW INGREDIENT -----
app.post('/ingredients', urlencodedParser, async (req, res) => {
    const { name, avgWeight, flavor, edibleRaw, origin, color, scientificName } = req.body;
    if (!name || !avgWeight || !flavor || typeof edibleRaw === 'undefined' || !origin || !color || !scientificName) {
        req.flash('error', 'All fields are required');
        return res.redirect('/ingredients/new');
    }
    //switch edibleRaw to boolean from string
    const isEdibleRaw = edibleRaw === 'option1';
    
    const avgWeightFloat = parseFloat(avgWeight);
    if (isNaN(avgWeightFloat)) {
        req.flash('error', 'Average weight must be a number');
        return res.redirect('/ingredients/new');
    }
    try{
        const newIngredient = await Ingredient.create({
        name: name,
        avgWeight: avgWeightFloat,
        flavor: flavor,
        edibleRaw: isEdibleRaw,
        origin: origin,
        color: color,
        scientificName: scientificName,
    })
    console.log('-----new ingredient-----', newIngredient);
        res.redirect('/ingredients');
} catch(error){
        console.log('-----error-----\n', error);
        res.send('<h1>Error creating ingredient</h1>')
    }
});

// ===== GET ROUTES ===== 
//----- HOME -----
app.get('/', (req, res) => {
    res.render('home', {});
});

// ----- ALL INGREDIENTS -----
app.get('/ingredients', async (req, res) => {
    try {
        const ingredient = await Ingredient.find({ name: {$gt: 0} })
        res.render('data/allingredients', { allIngredients: ingredient });
        } catch (error) {
        res.status(404).send('<h1>404! Page Not Found.</h1>')
    }
});

// ----- NEW INGREDIENT -----
app.get('/ingredients/new', (req, res) => {
    res.render('data/newIng', {});
});

//----- SINGLE INGREDIENT -----
app.get('/ingredients/:ingredientName', async (req, res) => {

    try {
        const foundIngredient = await Ingredient.findOne({ name: req.params.ingredientName})
        if (foundIngredient.name && foundIngredient.avgWeight && foundIngredient.flavor && 
            foundIngredient.edibleRaw && foundIngredient.origin && foundIngredient.color && 
            foundIngredient.scientificName) {
                res.render('data/ingredients', {ingredient: foundIngredient});
            }
        } catch (error) {
        res.status(404).send('<h1>404! Page Not Found.</h1>')
    }
});

//----- EDIT INGREDIENT -----
app.get('/ingredients/:ingredientName/edit', async (req, res) => {
    try{
        const ingredient = await Ingredient.findOne({ name: req.params.ingredientName});
        res.render('data/editingredient', {ingredient: ingredient});
    } catch (error) {
        res.status(404).send('<h1>404! Page Not Found.</h1>')
    }
});

// ----- DELETE INGREDIENT -----
app.get('/ingredients/:ingredientName/delete', async (req, res) => {
    try{
        const ingredient = await Ingredient.findOne({ name: req.params.ingredientName});
        res.render('data/deleteingredient', {ingredient: ingredient});
    } catch (error) {
        res.status(404).send('<h1>404! Page Not Found.</h1>')
    }
});

// ----- ALL RECIPES -----
app.get('/recipes', async (req, res) => {
    try {
        const recipe = await Recipe.find({ id: {$gt:0 } })
        res.render('data/allrecipes', { allRecipes: recipe });
        } catch (error) {
        res.status(404).send('<h1>404! Page Not Found.</h1>')
    }
});

//----- SINGLE RECIPE -----
app.get('/recipes/:recipeID', async (req, res) => {

    try {
        const foundRecipe = await Recipe.findOne({ id: req.params.recipeID})
        if (foundRecipe.name && foundRecipe.prepTime && foundRecipe.cookTime && 
            foundRecipe.totalTime && foundRecipe.servings && foundRecipe.ingredients && 
            foundRecipe.directions && foundRecipe.submittedBy) {
                res.render('data/recipes', { recipe: foundRecipe });
            }
        } catch (error) {
        res.status(404).send('<h1>404! Page Not Found.</h1>')
    }
});

// ----- ALL BLOGS -----
app.get('/blogs', async (req, res) => {
    try {
        const blog = await Blog.find({ title: {$gt: 0} })
        res.render('data/allblogs', { allBlogs: blog });
        } catch (error) {
        res.status(404).send('<h1>404! Page Not Found.</h1>')
    }
});

app.get('/blogs/new', isLoggedIn, (req, res) => {
    res.render('auth/newblog', {});
});

// ----- SINGLE BLOG POST -----
app.get('/blogs/:blogID', async (req, res) => {

    try {
        const foundBlog = await Blog.findOne({ id: req.params.blogID})
        if (foundBlog.title && foundBlog.id && foundBlog.postedWhen && 
            foundBlog.postedBy && foundBlog.content && foundBlog.relatedImages) {
                res.render('data/blogs', { blog: foundBlog });
            }
        } catch (error) {
        res.status(404).send('<h1>404! Page Not Found.</h1>')
    }
});

// ------ AUTHENTICATED ROUTE: user profile -----
app.get('/profile', isLoggedIn, (req, res) => {
    const { name, email, phone } = req.user;
    res.render('profile', { name, email, phone });
});

// ===== CATCH BAD LINKS =====
app.all('*', (req, res) => {
    res.status(404).send('<h1>404! Page Not Found.</h1>');
});

// ===== SERVER LISTENER ===== 
const server = app.listen(PORT, () => {
    console.log('listening at PORT ', PORT);
});

module.exports = server;