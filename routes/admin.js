var express = require('express');
var router = express.Router();
const Product = require('../models/product');
const Catagory = require('../models/catgory');


// Get all Products
router.get('/all', async (req, res) => { //work
    //  if (req.session.user) {
    //      try {
    let allProducts = await Product.find();
    res.json(allProducts);
    console.log(allProducts)
    //      } catch (err) {
    //          typeof err === "string" ? res.send(err) : res.sendStatus(500);
    //      }
    //  }
});

//checks if the id of the new Product is taken
router.post('/isTaken', async (req, res) => { //work
    // if (req.session.user) {
    //     try {
    let foundItem = await Product.find({
        id: req.body.id
    });
    foundItem[0] ? res.json(true) : res.json(false);
    //     } catch (err) {
    //         typeof err === "string" ? res.send(err) : res.sendStatus(500);
    //     }
    // }
});

// Add a Product
router.post('/', async (req, res) => { //work
    //  if (req.session.user) {
    //  try {
        /*  CHECK IF CATAGORY EXIST IF YES SAVE PRODUCT <-> IF NOT AND req.query="new catagory" THEN CREATE NEW CATAGORY AND SAVE PRODUCT */
    let addedProduct = new Product(req.body);
    let addCatagory = new Catagory(req.body);
    Catagory.find({catagoryName:req.body.catagoryName},function(err,catagory){
        if(err) throw err;
        if(catagory.length>0){
            //if catagory exist
            addedProduct.save(function(error, data){
                if(error) { throw error};
                res.json(data._doc);
            } );;
        }else{
            addCatagory.save(function(error, newcatagory){
                if(error) { throw error};
                if(newcatagory){
                  //if catagory created succssesfuly
                  addedProduct.save(function(error, data){
                        if(error) { throw error};
                        res.json(data._doc);
                    } );;
                }
            } );;
        }
    })
    
    // res.json(newProduct);
    //      } catch (err) {
    //          typeof err === "string" ? res.send(err) : res.sendStatus(500);
    //       }
    //  }
});

// Update a Product
router.put('/:id', async (req, res) => { //work
    //  if (req.session.user) {
    //      try {
    let foundProduct = await Product.findOneAndUpdate({
        id: req.params.id
    }, req.body, {
        new: true
    });
    res.json(foundProduct);
    //      } catch (err) {
    //          typeof err === "string" ? res.send(err) : res.sendStatus(500);
    //      }
    //  }
});

module.exports = router;