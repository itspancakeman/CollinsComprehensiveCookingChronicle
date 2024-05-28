const { User } = require('../models');

User.create({
    name: 'Collin St-Onge',
    email: 'collinjst.onge@gmail.com',
    phone: '734-489-2138',
    password: 'heytherecutiepie'
})
.then(user => {
    console.log('----new user----\n', user);
})
.catch(error => {
    console.log('----error creating user----\n', error);
});