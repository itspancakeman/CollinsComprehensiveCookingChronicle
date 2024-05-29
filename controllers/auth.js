const express = require('express');
const router = express.Router();
const passport = require('../config/passport-config');

// import the user model
const { User } = require('../models');

//====== GET ROUTES =====
//----- SIGNUP PAGE -----
router.get('/signup', (req, res) => {
    res.render('auth/signup', {});
});

//----- LOGIN PAGE -----
router.get('/login', (req, res) => {
    res.render('auth/login', {});
});

// ---- LOGOUT -----
router.get('/logout', (req, res) => {
    res.locals.currentUser = null;
    req.logOut((error, next) => {
        if (error) {
            req.flash('error', 'Error logging out. Please try again.');
            return next(error);
        }
        req.flash('success', 'Logging out... See you next time!');
        res.redirect('/');
    })
});

// ====== POST ROUTES ===== 
router.post('/signup', async (req, res) => {
    try {
        const findUser = await User.findOne({ email: req.body.email });
        if (!findUser) {
            const newUser = await User.create({
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                password: req.body.password
            });
            console.log('----- NEW USER ----\n', newUser);
            passport.authenticate('local', {
                successRedirect: '/profile',
                successFlash: `Welcome ${newUser.name}! Account created.`
            })(req, res);
        } else {
            req.flash('error', 'Email already exists. Try another email');
            res.redirect('/auth/signup');
        }
    } catch (error) {
        console.log('----- ERROR IN SIGNUP POST ----', error);
        if (error.errors.phone.name === 'ValidatorError') {
            req.flash('error', 'Phone number needs be for in format XXX-XXX-XXXX');
            res.redirect('/auth/signup');
        }
    }
});

    

router.post('/login', passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/auth/login',
    successFlash: 'Welcome back to your account!',
    failureFlash: 'Either your email or password is incorrect, please try again.'
}), (req, res) => {

});

module.exports = router;