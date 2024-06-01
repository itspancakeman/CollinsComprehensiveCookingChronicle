const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {type: String, required: true},
    id: {type: Number, required: true},
    postedWhen: {type: String, required: true},
    postedBy: {type: String, required: true},
    content: {type: Object, required: true},
    relatedImages: {type: Object, required: false}
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;