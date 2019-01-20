const mongoose = require('mongoose');


const user = mongoose.model('user', {
    id: String,
    isAdmin:[{type:Boolean},{default:false}],
    firstName: String,
    lastName: String,
    email: String,
    pass: String,
    city: String,
    street: String,
    default: false
});

module.exports = user;