const express = require('express');
const app = express();
const router = express.Router();
const passport = require('../models');

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
app.post('/signup', async (req, res) => {
    try {
        const findUser = await User.findOne({ email: req.body.email });
        if (!findUser) {
            const newUser = await User.create({
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                password: req.body.password
            });

            passport.authenticate('local', {
                successRedirect: '/',
                successFlash: `Welcome ${newUser.name}. Account Created.`
            })(req, res);
        } else {
            req.flash('error', 'Phone number needs to be formatted as XXX-XXX-XXXX');
            res.redirect('/signup');
        }
    } catch (error) {
        console.log('----ERROR IN SIGNUP POST----', error);
        if (error.errors.phone.name === 'ValidatorError') {
            req.flash('error', 'Phone number needs to be formatted as XXX-XXX-XXXX');
            res.redirect('/signup');
        }
    }
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    successFlash: 'Welcome back to your account!',
    failureFlash: 'Either your email or password is incorrect, please try again.'
}), (req, res) => {

});

module.exports = router;