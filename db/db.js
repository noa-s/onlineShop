var express = require('express');
var app = express();
const mongoose=require('mongoose'); //Mongoose
const bcrypt = require('bcrypt');
const saltRounds = 10;
const User= require('../models/user');

module.exports= {
    // Automatic load Admin
    addAdmin:async ()=>{
        let adminObj={
            id:300,
            firstName:"vova", 
            lastName:"kapp",
            email:"test@gmail.com",
            pass:"123",
            city:"holon",
            street:"harava",
            isAdmin:[true]
        };
        await bcrypt.hash(adminObj.pass, saltRounds,function(err,hash){
            if(err) throw err;
            adminObj.pass=hash;
            return new User(adminObj).save();
        });
    },

};