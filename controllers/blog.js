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

router.put('/:blogID', urlencodedParser, async (req, res) => {

    const { title, id, postedWhen, postedBy, post, post2, relatedImages } = req.body;

    try {
        const updatedBlog = await Blog.findOneAndUpdate(
            { id: req.params.blogID },
            {
                title: title,
                id: id,
                postedWhen: postedWhen,
                postedBy: postedBy,
                content: {post, post2},
                relatedImages: relatedImages
            },
            {returnNewDocument: true}
        );
        if (updatedBlog) {
            res.redirect('/blogs');
        }
    } catch (error) {
        console.log('----error-----', error);
        req.flash('error', 'Error updating ingredient');
        res.redirect('/');
    }
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
    const { title, id, post, post2, img, img2 } = req.body;
    const user = req.user.name
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
                postedBy: user,                                                                                                               
                content: {post, post2},
                relatedImages: {img, img2}
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