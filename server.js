// ===== GLOBAL VARIABLES =====
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const flash = require('connect-flash');
const session = require('express-session');
const PORT = process.env.PORT || 3000;
const passport = require('./config/passport-config');
const isLoggedIn = require('./middleware/isLoggedIn');
const SECRET_SESSION = process.env.SECRET_SESSION;
const methodOverride = require('method-override');
const axios = require('axios');
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
app.use(methodOverride('_method'));
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.alerts = req.flash();
    res.locals.currentUser = req.user;
    next();
});

// ---- import auth routes -----
app.use('/auth', require('./controllers/auth'));
app.use('/blogs', require('./controllers/blog'));

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

app.put('/ingredients/:ingredientName', async(req, res) => {
    try {
        const { name, avgWeight, flavor, edibleRaw, origin, color, scientificName } = req.body;
        const isEdibleRaw = edibleRaw === 'option1';
        const avgWeightFloat = parseFloat(avgWeight);
        if (isNaN(avgWeightFloat)) {
            req.flash('error', 'Average weight must be a valid number');
            return res.redirect(`/ingredients/${req.params.ingredientName}/edit`);
        }
        const updatedIngredient = await Ingredient.findOneAndUpdate(
            { name: req.params.ingredientName },
            {
                name: name,
                avgWeight: avgWeightFloat,
                flavor: flavor,
                edibleRaw: isEdibleRaw,
                origin: origin,
                color: color,
                scientificName: scientificName
            },
            { new: true }
        );
        if (updatedIngredient) {
            
            res.redirect('/ingredients');
        } else {
            req.flash('error', 'Ingredient not found');
            res.redirect('/ingredients');
        }
    } catch (error) {
        console.log('----error-----', error);
        req.flash('error', 'Error updating ingredient');
        res.redirect('/ingredients');
    }
});

app.delete('/ingredients/:ingredientName', (req, res) => {
    Ingredient.deleteOne({ name: req.params.ingredientName}).then(function(){
        res.redirect('/ingredients');
    }).catch(function(error){
        console.log('----error----', error);
    })
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

app.get('/recipes/tasty', (req, res) => {
    axios.get('https://tasty.p.rapidapi.com/recipes/list', {
        headers: {'x-rapidapi-key': process.env.X_RAPIDAPI_KEY, 'x-rapidapi-host': 'tasty.p.rapidapi.com'}
})
.then((response) => {

    

    const recipeObject = {
        name: response.data.results[0].name,
        cookTime: response.data.results[0].cook_time_minutes,
        prepTime: response.data.results[0].prep_time_minutes,
        servings: response.data.results[0].num_servings,
        ingredients: {
            ing1: response.data.results[0].sections[0].components[0].raw_text,
            ing2: response.data.results[0].sections[0].components[1].raw_text,
            ing3: response.data.results[0].sections[0].components[2].raw_text,
            ing4: response.data.results[0].sections[0].components[3].raw_text,
            ing5: response.data.results[0].sections[0].components[4].raw_text,
            ing6: response.data.results[0].sections[0].components[5].raw_text,
            ing7: response.data.results[0].sections[0].components[6].raw_text,
            ing8: response.data.results[0].sections[0].components[7].raw_text,
            ing9: response.data.results[0].sections[0].components[8].raw_text,
            ing10: response.data.results[0].sections[0].components[9].raw_text,
            ing11: response.data.results[0].sections[0].components[10].raw_text,
        },
        directions: {
            step1: response.data.results[0].instructions[0].display_text,
            step2: response.data.results[0].instructions[1].display_text,
            step3: response.data.results[0].instructions[2].display_text,
            step4: response.data.results[0].instructions[3].display_text,
    }}
    res.render('data/tasty', {tasty: recipeObject});
    })
    .catch(error => {
        console.log('=====ERROR=====', error)
    })
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
            foundBlog.postedBy && foundBlog.content) {
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