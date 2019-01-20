var express = require('express');
var router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const salt = 10;

router.get('/isUserLogged', async (req, res) => {
  if (req.session.user) {
    let foundUser = await User.find({
      id: req.session.user.id
    });
    res.json(foundUser);
  } else
    res.sendStatus(403);
});

router.post('/idEmailTaken', async (req, res) => {
  let idFlag = false,
    emailFlag = false;
  try {
    let isTaken = await User.find({
      id: req.body.id
    });
    let emailTaken = await User.find({
      email: req.body.email
    });
    idFlag = isTaken[0] ? true : false;
    emailFlag = emailTaken[0] ? true : false;
    idFlag && emailFlag ? res.json([true, true]) :
      (idFlag ? res.json([true, false]) : (emailFlag ? res.json([false, true]) : res.json([false, false]))); // true: taken ; false:untaken
  } catch (err) {
    typeof err === "string" ? res.send(err) : res.sendStatus(500);
  }
});

router.post('/register', async (req, res) => {
  debugger
  let userObj = req.body;
  if (userObj.id &&
    userObj.firstName &&
    userObj.lastName &&
    userObj.email &&
    userObj.pass &&
    userObj.city &&
    userObj.street) {
    console.log(userObj)
    try {
      await bcrypt.hash(userObj.pass, salt, async (err, hash) => {
        if (err) res.send(err);
        userObj.pass = hash;
        let newUser = new User(userObj);
        // newUser.isAdmin[0] = false;
        await newUser.save();
        res.json(newUser[0]);
      });
    } catch (err) {
      typeof err === "string" ? res.send(err) : res.sendStatus(500);
    }
  } else
    res.sendStatus(403);
});



router.post('/login', async (req, res) => {
  let id = req.body.id;
  let pass = req.body.pass;
  console.log(id, pass)
  // if (match) {
  //   req.session.user = {
  //     id: currUser[0].id
  //   };
  //   const foundUser = currUser[0];
  //   delete foundUser.pass;
  //   res.json(foundUser);
  // } else
  //   res.json({
  //     Error: {
  //       validPassword: false
  //     }
  //   });
  try {
    User.find({id:id}, function(err,data){
      let userExist=data.filter(async u=>{
        if (err) throw err;
        let match = await bcrypt.compare(pass, u.pass);
        if(match) return u;

      });
      if(data.length==1 && userExist.length>0){
        req.session.user = {
          id: userExist[0].id
        };
        res.json(userExist);
      }else{
        res.json("error");
      }
    });
    // let currUser = await User.find({
    //   id: id
    // });
    // if (currUser[0]) {
    //   let match = await bcrypt
    //     .compare(pass, currUser[0].pass);
    //   if (match) {
    //     req.session.user = {
    //       id: currUser[0].id
    //     };
    //     const foundUser = currUser[0];
    //     delete foundUser.pass;
    //     res.json(foundUser);
    //   } else
    //     res.json({
    //       Error: {
    //         validPassword: false
    //       }
    //     });
    // } else
    //   res.json({
    //     error: "Login Details Wrong"
    //   });
  } catch (err) {
    typeof err === "string" ? res.send(err) : res.sendStatus(500);
  }
});


// router.get('/logout', (req, res) => {
//   if (req.session)
//     req.session.destroy();
//   //   err=>{
//   //     if(err) throw err ;
//   //      res.json({loggedOut: true});
//   //  }
// });

router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    res.clearCookie("connect.sid");
    res.json({loggedOut: true});
  });
});


router.get('/', async  (req, res, next)=> {
  let allUser = await User.find({
    loggedOut: true
  });
  res.json(allUser);
});
module.exports = router;