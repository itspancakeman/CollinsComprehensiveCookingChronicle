const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    email: {type: String, require: true, unique: true},
    password: { type: String, required: true},
    phone: {
        type: String,
        validate: {
            validator: function(v) {
                return /\d{3}-\d{3}-\d{4}/.test(v)
            },
            message: props => `${props.value} is not a valid phone number!`
        },
        required: [true, 'Your phone number is required!']
    }
}, {timestamps: true});

userSchema.pre('save', function(next) {
    console.log('-----password-----', this.password) // delete later
    let hash = bcrypt.hashSync(this.password, 12);
    console.log('----hash----', hash); // delete later
    this.password = hash;
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;