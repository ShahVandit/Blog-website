var express = require('express');
var passport=require('passport');
var router = express.Router();
var bcrypt=require('bcrypt');
var flash=require('connect-flash');
var multer=require('multer');
// Schema
var users=require('../models/userSchema');
var ensureAuth = require('../config/isAuth').ensureAuth;
var blogSchema=require('../models/blog');

const storage= multer.diskStorage({
  destination:function(req,file,cb){
    cb(null,'./images/');
  },
  filename:function(req,file,cb){
    cb(null,file.originalname);
  }
});

const limits = {
  fileSize: 1024*1024*5,
}

var fileFilter=function(req,file,cb){
  if(file.mimetype=='image/jpeg'||file.mimetype=='image/jpg' || file.mimetype=='image/png'){
    cb(null,true);
  }
    else{
      var blogerrors=[];
      cb(new Error('Please insert an image'),false);
      // res.redirect('createblog',{data:req.user});
    }
  
  }

var uploads=multer({storage:storage,limits:limits,fileFilter:fileFilter});

/* GET users listing. */
router.get('/login', function(req, res) {
  res.render('login');
});
router.get('/register', function(req, res) {
  res.render('register');
});

router.get('/dashboard',ensureAuth,(req,res)=>{
  res.render('dashboard',{data:req.user});
});

router.get('/createblog',ensureAuth,(req,res)=>{
  res.render('createblog',{data:req.user});
});

router.get('/viewblog',ensureAuth,(req,res)=>{
  res.render('viewblog',{data:req.user});
});

router.get('/logout',(req,res)=>{
  req.logout();
  req.flash('success_msg','You have logged out');
  res.redirect('login'); 
});
// POST requests
router.post('/register',(req,res)=>{
  // Validation
  var errors=[];
  const {name,email,password,password2} = req.body;
  if(!name,!email,!password,!password2){
    errors.push({msg:'All fields are required'});
  }
  if(password!=password2){
    errors.push({msg:'Re-enter the passwords'});
  }
  if(password.length<4){
    errors.push('Password length is small');
  }
  if(errors.length>0){
    res.render('register',{errors,
    name,
    password,
    password2,
    email
})
  }
  else{
    //  After validation passed
    users.findOne({email:email})
    .then(user=>{
      if(user){
        errors.push({msg:'Email already exists'});
        res.render('register',{errors,
        name,
        password,
        password2,
        email
      });
      }else{
        const newUser=new users({
          name,
          email,
          password
        });
        // Hashing
        bcrypt.genSalt(10,(err,salt)=>
          bcrypt.hash(newUser.password,salt, (err,hash)=>{        
            if(err)  throw err;                      
              newUser.password=hash;
              newUser.save()
              .then(user=>
                {req.flash('success_msg','You have created an account,you can login');
                  res.redirect('login');
              })
              .catch((err)=> console.log(err));
            
          }))
        
      }
    }).catch(err=>console.log(err));
  }
  });

router.post('/login',(req,res,next)=>{
  passport.authenticate('local',{
    successRedirect:'dashboard',
    failureRedirect:'login',
    failureFlash: true
  })(req,res,next);
});

router.post('/createblog',uploads.single('filename'),(req,res)=>{
  const {author,topic,content}=req.body;
  console.log(req.file);
  var imgname=req.file.originalname;
  console.log(imgname);
  if(!author || !topic || !content ||!imgname){
    var blogerrors=[];
    blogerrors.push({msg:'Please fill in all the details'});
    res.render('createblog',{blogerrors,data:req.user});
  }
  else{
    var data= new blogSchema({
      author:author,
      topic:topic,
      content:content,
      image:imgname
    });
    data.save()
    .then(user=>{req.flash('createblogs_msg','Blog created successfully');
      res.redirect('viewblog');})
    .catch(err=>console.log(err));
  
  }
});

module.exports=router;