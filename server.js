// ===== GLOBAL VARIABLES =====
require('dotenv').config();
const express = require('express');
const app = express();
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const PORT = process.env.PORT || 3000;
// const passport = require('./config/passport-config');
// const isLoggedIn = require('./middleware/isLoggedIn');
// const SECRET_SESSION = process.env.SECRET_SESSION;

// ====== MIDDLEWARE ====== 
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
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

// ===== GET ROUTES ===== 
//----- HOME -----
app.get('/', (req, res) => {
    res.render('home', {});
});


// ===== SERVER LISTENER ===== 
const server = app.listen(PORT, () => {
    console.log('listening at PORT ', PORT);
});

module.exports = server;