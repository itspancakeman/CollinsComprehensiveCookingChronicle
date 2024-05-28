const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { validPassword } = require('../utils');
const { User } = require('../models');

const STRATEGY = new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
}, async (username, password, callback) => {
    try {
        const user = await User.findOne({ username });

        if (!user || !validPassword(password, user.password)) {
            callback(null, false);
        } else {
            callback(null, user);
        }
    } catch (error) {
        console.log('----error-----\n', error);
    }
});

passport.serializeUser((user, callback) => {
    callback(null, user.username);
});

passport.deserializeUser(async (username, callback) => {
    try {
        const user = await User.findOne({ username });

        if (user) {
            callback(null, user);
        }
    } catch (error) {
        console.log('-----error in passport config-----\n', error);
    }
});

passport.use(STRATEGY);
module.exports = passport;