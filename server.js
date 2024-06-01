// ===== GLOBAL VARIABLES =====
require('dotenv').config();
const express = require('express');
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
app.use(express.urlencoded({ extended: false }));
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

// ===== GET ROUTES ===== 
//----- HOME -----
app.get('/', (req, res) => {
    res.render('home', {});
});

//----- SINGLE INGREDIENT -----
app.get('/ingredients/:ingredientName', async (req, res) => {

    try {
        const foundIngredient = await Ingredient.findOne({ name: req.params.ingredientName})
        console.log(foundIngredient);
        if (foundIngredient.name && foundIngredient.avgWeight && foundIngredient.flavor && 
            foundIngredient.edibleRaw && foundIngredient.origin && foundIngredient.color && 
            foundIngredient.scientificName) {
                res.render('data/ingredients', {ingredient: foundIngredient});
            }
        } catch (error) {
        res.status(404).send('<h1>404! Page Not Found.</h1>')
    }
});

//----- SINGLE RECIPE -----
app.get('/recipes/:recipeID', async (req, res) => {

    try {
        const foundRecipe = await Recipe.findOne({ id: req.params.recipeID})
        console.log(foundRecipe);
        if (foundRecipe.name && foundRecipe.prepTime && foundRecipe.cookTime && 
            foundRecipe.totalTime && foundRecipe.servings && foundRecipe.ingredients && 
            foundRecipe.directions && foundRecipe.submittedBy) {
                res.render('data/recipes', { recipe: foundRecipe });
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

app.all('*', (req, res) => {
    res.status(404).send('<h1>404! Page Not Found.</h1>');
});

// ===== SERVER LISTENER ===== 
const server = app.listen(PORT, () => {
    console.log('listening at PORT ', PORT);
});

module.exports = server;