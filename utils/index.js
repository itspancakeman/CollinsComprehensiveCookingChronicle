const bcrypt = require('bcryptjs');

function validPassword(typePassword, userPassword) {
    let isCorrectPassword = bcrypt.compareSync(typePassword, userPassword);

    return isCorrectPassword; // should return boolean value
}

module.exports = {
    validPassword,
    //other methods here if needed
}