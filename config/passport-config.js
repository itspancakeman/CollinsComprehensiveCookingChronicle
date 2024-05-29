const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { validPassword } = require('../utils');
const { User } = require('../models');

const STRATEGY = new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, callback) => {
    try {
        const user = await User.findOne({ email });

        if (!user || !validPassword(password, user.password)) {
            callback(null, false);
        } else {
            console.log(user);
            callback(null, user);
        }
    } catch (error) {
        console.log('----error-----\n', error);
        callback(error);
    }
});

passport.serializeUser((user, callback) => {
    callback(null, user.email);
});

passport.deserializeUser(async (email, callback) => {
    try {
        const user = await User.findOne({ email });

        if (user) {
            callback(null, user);
        }
    } catch (error) {
        console.log('-----error in passport config-----\n', error);
    }
});

passport.use(STRATEGY);
module.exports = passport;