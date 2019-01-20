const mongoose=require('mongoose');

const cart= mongoose.model('cart',{
    id:String,
    userId:String, // user prop
    creationDate:String  // new Date
});

module.exports=cart;