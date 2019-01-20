const mongoose = require('mongoose');

const catagory = mongoose.model('catagory', {
    id: String,
    catagoryName: String,
});

module.exports = catagory;