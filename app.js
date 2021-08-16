// Dependencies
var createError = require('http-errors');
var express = require('express');
const expressLayouts = require('express-ejs-layouts');
const passport=require('passport');
var path = require('path');
var cookieParser = require('cookie-parser');
var session=require('express-session');
var logger = require('morgan');
var mongoose= require('mongoose');
var ejs=require('ejs');
var jade=require('jade');
var bcrypt=require('bcrypt');
var flash=require('connect-flash');
var mongodb=require('mongodb');
// Routers

require('./config/passport')(passport);
// DB Config
var db=require('./config/key').MongoURI;
var app = express();
// Connect Database

mongoose.connect(db,{useNewUrlParser:true,useUnifiedTopology: true})
.then(()=>{console.log('Mongoose connected');})
.catch((err)=>console.log(err));

// view engine setup
app.use(expressLayouts)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
  secret: 'random',
  resave: true,
  saveUninitialized: true,
}));
// Passport use
app.use(passport.initialize());
app.use(passport.session());
// Flash
app.use(flash());

// Global Variables
app.use((req,res,next)=>{
  res.locals.success_msg=req.flash('success_msg');
  res.locals.error_msg=req.flash('error_msg');
  res.locals.error=req.flash('error');
  res.locals.createblogs_msg=req.flash('createblogs_msg');
  next();
});


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

app.use('/', indexRouter);
app.use('/users', usersRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT,(err,res)=>{
  if(err){console.log(err);}
  else{
  console.log('Listening',PORT);}

});

module.exports = app;