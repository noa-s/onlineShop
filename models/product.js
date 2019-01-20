const mongoose=require('mongoose');

const product= mongoose.model('product',{
    id:String,
    name:String, 
    catagoryName:String,
    price:Number,
    imgUrl:String,
});

module.exports=product;