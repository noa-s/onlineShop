var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var session = require('express-session');
var bodyParser = require('body-parser');
const MongoStore = require("connect-mongo")(session);

var app = express();

const db = require('./DB/db');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var shopRouter = require('./routes/shop');
var adminRouter = require('./routes/admin');
var auth = require('./routes/auth')

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// db.addAdmin();
mongoose.connect('mongodb://localhost/online-market');
app.use(
  session({
    secret: "MC7-1K8427X001-1X8M4Y128Y-NX-N821UX",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection
    })
  })
);

app.use('/', indexRouter);
app.use('/allusers', usersRouter);
app.use('/auth', auth);
app.use('/admin', adminRouter);
app.use('/shop', shopRouter);


app.use(function (req, res, next) {
  next(createError(404));
});


app.use(function (err, req, res, next) {

  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;