const mongoose=require('mongoose');

const order= mongoose.model('order',{
    id:String, 
    userId:String, // user prop
    cartId:String, //cart prop
    orderDate:String, // new Date
    dateToDeliever:String,    //form in component
    creditCard:String,  //form in component 
    city:String,    //form in component
    street:String,  //form in component
    finalPrice:Number,   //cartproducts prop
    status:String
});

module.exports=order;