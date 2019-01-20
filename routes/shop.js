var express = require('express');
var router = express.Router();
const Product = require('../models/product');
const Order = require('../models/order');
const Catagory = require('../models/catgory');
const Cartproduct = require('../models/cartProduct');
const Cart = require('../models/cart');
const fs = require('fs');


let cartId = 0; 

//get all the products from the Data Base
router.get('/', async (req, res) => { //work
    //  if(req.session.user){
    //      try{
  
    let allProducts = await Product.find({});
    res.json(allProducts);
    console.log(allProducts)
    //  }
    //      catch(err){
    //          typeof err === "string" ? res.send(err) : res.sendStatus(500);
    //      }
    //  }        
});

// get all the catagories
router.get('/allCatagories', async (req, res) => {
    //  if(req.session.user)    {
    //  try {
        Catagory.find({},function(err,catagories){
            if(err) throw err;
            res.json(catagories);
        });
    // let allCatagories = await Catagory.find({});
    // console.log(allCatagories)
    // res.json(allCatagories);

    //   }
    //  catch(err){
    //      typeof err === "string" ? res.send(err) : res.sendStatus(500);
    //  }
    //  }
});

// Get count of all Products
router.get('/allProducts', async (req, res) => { //work
    //      try{
    let allProducts = await Product.find({});
    res.json(allProducts);
    //      }
    //      catch(err){
    //          typeof err === "string" ? res.send(err) : res.sendStatus(500);
    //      }
});

// Get count of all Orders
router.get('/allOrders', async (req, res) => { //work
    try {
        let allOrders = await Order.countDocuments();
        res.json(allOrders);
    } catch (err) {
        typeof err === "string" ? res.send(err) : res.sendStatus(500);
    }
});

// get Catagory Id By name, then get the products of the catagory





// router.get('/:newcatagoryName', async (req, res) => { //work
//     Product.aggregate({
//         $group: {
//             catagoryId: "$catagoryId",
//             // total: { $sum: "$amount" },
//         }
//     },function(err,data){
//     if (err) throw err;
//     res.json(data);
// })

// });
router.get('/:catagoryName', async (req, res) => { //work
    //  if (req.session.user) {
    //      try {
    let catagory = await Catagory.find({
        "catagoryName": {
            "$regex": req.params.catagoryName,
            "$options": "i"
        }
    });
     await Product.find({ catagoryName: catagory[0].catagoryName }, function(err,data){
        res.json(data);
        console.log(data)
    });

    //  } catch (err) {
    //      typeof err === "string" ? res.send(err) : res.sendStatus(500);
    //  }
    //  }
});

// Get A Product by name
router.get('/search/:product', async (req, res) => { //work
    //  if (req.session.user) {
    //      try {
    let foundProduct = await Product.find({
        "name": {
            "$regex": req.params.product,
            "$options": "i"
        }
    });
    foundProduct[0] ? res.json(foundProduct) : res.json(`Not match product`);
    //      } catch (err) {
    //          typeof err === "string" ? res.send(err) : res.sendStatus(500);
    //      }
    //  }
});


//check if there is a Open cart for the user
router.post('/isThereCart', async (req, res) => { //work
    //  if (req.session.user) {
    //      try {
    let foundCart = await Cart.find({
        userId: req.session.user.id
    }); // in build
    if (foundCart[0])
        res.json(foundCart);
    else
        res.json(false);
    //      } catch (err) {
    //          typeof err === "string" ? res.send(err) : res.sendStatus(500);
    //      }
    //  }
});

//check if there is a Open cart for the user
router.post('/isLastOrder', async (req, res) => { //work
    //  if (req.session.user) {
    //      try {
    let foundOrder = await Order.find({
        userId: req.session.user.id,
        status: 'Ordered'
    });
    if (foundOrder[0])
        res.json(foundOrder[0]);
    else
        res.json(false);
    //      } catch (err) {
    //          typeof err === "string" ? res.send(err) : res.sendStatus(500);
    //      }
    //  }
});
//Check if shipping Date is Available
router.post('/dateExiset', async (req, res) => {
    //  if (req.session.user) {
    //      try {
    let allShipAtDate = await Order.find({
        dateToDeliever: req.body.dateToDeliever
    });
    let countShips = allShipAtDate.length;
    countShips > 2 ? res.json(false) : res.json(true);
    //      } catch (err) {
    //          typeof err === "string" ? res.send(err) : res.sendStatus(500);
    //      }
    //  }
});
//create a cart
router.post('/newCart', async (req, res) => { //work
    //  if (req.session.user) {
    let cartObj = {
        id: cartId,
        userId: req.session.user.id,
        creationDate: new Date().toISOString().split('T')[0]
    };
    if (cartObj.userId) {

        try {
            let newCart = new Cart(cartObj);
            let addedCart = await newCart.save();
            cartId++;
            res.json(addedCart);
        } catch (err) {
            typeof err === "string" ? res.send(err) : res.sendStatus(500);
        }
    }
    // }
});

// get all Cart Products by its id
router.post('/cartProducts', async (req, res) => { //work
    //  if (req.session.user) {
    try {
        let allCartProducts = await Cartproduct.find({
            cartId: req.body.cartId
        });
        res.json(allCartProducts);
    } catch (err) {
        typeof err === "string" ? res.send(err) : res.sendStatus(500);
    }
    //  }
});

// Get the total price of the cart
router.post('/totalPrice', async (req, res) => { // work
    //  if (req.session.user) {
    try {
        let totalPrice = 0;
        let allCartProducts = await Cartproduct.find({
            cartId: req.body.cartId
        });
        allCartProducts.forEach(cartProduct => totalPrice += cartProduct.totalPrice);
        res.json(totalPrice);
        console.log(totalPrice)
    } catch (err) {
        typeof err === "string" ? res.send(err) : res.sendStatus(500);
    }
    //    }
})

//add Prodcut to cart
router.post('/addCartProduct', async (req, res) => { //work
    // if (req.session.user) {
    let newCartProduct = new Cartproduct(req.body); // the Info that been added is amount and TotalPrice
    try {
        let addedCartProduct = await newCartProduct.save();
        res.json(addedCartProduct);
    } catch (err) {
        typeof err === "string" ? res.send(err) : res.sendStatus(500);
    }
    //}
});

//Place Cart To Order - after 'submitting Order'
router.post('/orderCart', async (req, res) => { //work
    //  if (req.session.user) {
    if (req.body.id && req.body.userId &&
        req.body.orderDate && req.body.dateToDeliever &&
        req.body.creditCard && req.body.finalPrice &&
        req.body.street) {
        //  try {
        let orderedCart = new Order(req.body); // adding the order
        let answer = await orderedCart.save();
        res.json(answer);
        //      } catch (err) {
        //          typeof err === "string" ? res.send(err) : res.sendStatus(500);
        //      }
        //  }
    }
});
// after ordering, deleting the cart from the collection
router.delete('/deleteCart', async (req, res) => { // work
    //  if (req.session.user) {
    try {
        let deleteCart = await Cart.findOneAndRemove({
            id: req.body.id
        });
        res.json(deleteCart);
    } catch (err) {
        typeof err === "string" ? res.send(err) : res.sendStatus(500);
    }
    // }
})

// Delete all Prodcuts from Cart
router.delete('/deleteAllCart', async (req, res) => { //work
    //  if (req.session.user) {
    try {
        let deleteAllProducts = await Cartproduct.deleteMany({
            cartId: req.body.cartId
        }); // BY specific Cart
        const rowsAffected = deleteAllProducts.n;
        rowsAffected > 0 ? res.json({
            DeletedAll: rowsAffected
        }) : res.json({
            DeletedAll: rowsAffected
        });
    } catch (err) {
        typeof err === "string" ? res.send(err) : res.sendStatus(500);
    }
    //  }
});

// Delete a Prodcut from Cart
router.delete('/:id', async (req, res) => { //work
    //  if (req.session.user) {
    try {
        let deletedCartProduct = await Cartproduct.findOneAndRemove({
            cartId: req.body.cartId,
            productId: req.params.id
        });
        deletedCartProduct ? res.json(deletedCartProduct) : res.json({
            Err: "not matched Product"
        });
    } catch (err) {
        typeof err === "string" ? res.send(err) : res.sendStatus(500);
    }
    //  }
});

module.exports = router;