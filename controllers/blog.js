const express = require('express');
const router = express.Router();
const passport = require('../config/passport-config');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });

// import the user model
const { Blog } = require('../models');
const isLoggedIn = require('../middleware/isLoggedIn');

// ----- EDIT BLOG POST -----
router.get('/:blogID/edit', isLoggedIn, async (req, res) => {
    try {
        const blog = await Blog.findOne({ id: req.params.blogID });
        res.render('auth/editblog', {blog: blog})
    } catch (error) {
        res.status(404).send('<h1>404! Page Not Found.</h1>')
    }
});

router.put('/:blogID', (req, res) => {
    try {
        Blog.updateOne({ id: req.params.blogID });
    } catch (error) {
        console.log('----error-----', error);
    }
    res.redirect('/blogs');
});

// ----- DELETE BLOG POST -----
router.get('/:blogID/delete', isLoggedIn, async (req, res) => {
    try {
        const blog = await Blog.findOne({ id: req.params.blogID });
        res.render('auth/deleteblog', {blog: blog});
    } catch (error) {
        res.status(404).send('<h1>404! Page Not Found.</h1>');
    }
});

router.delete('/:blogID', (req, res) => {
    Blog.deleteOne({ id: req.params.blogID }).then(function(){
        res.redirect('/blogs');
    }).catch(function(error){
        console.log('----error----', error);
    })
});

// ----- NEW BLOG POST -----
router.post('/', urlencodedParser, isLoggedIn, async (req, res) => {
    const { title, id, post, images } = req.body;
    const date = new Date();
    if (!title || !id || !post) {
        req.flash('error', 'Title, ID, and post are required');
        return res.redirect('/blogs/new');
    }

    try {
        const findId = await Blog.findOne({ id: id });
        if (!findId) {
            const newBlogPost = await Blog.create({
                title: title,
                id: id,
                postedWhen: date.toISOString(),
                postedBy: req.user._id,                                                                                                               
                content: post,
                relatedImages: images
            });
            console.log('-----new blog -----', newBlogPost);
            req.flash('success', 'Post successfully created!');
            return res.redirect('/blogs');
        } else {
            req.flash('error', 'ID already exists, please try again');
            return res.redirect('/blogs/new');
        }
    } catch (error) {
        console.log('-----error-----\n', error);
        req.flash('error', 'An error occurred while creating the blog post');
        return res.redirect('/blogs/new');
    }
});

module.exports = router;