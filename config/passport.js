const localStaryegy=require('passport-local').Strategy;
const bcrypt=require('bcrypt');
var passport=require('passport');
var user=require('../models/userSchema');

module.exports=(passport)=>{
    passport.use(new localStaryegy({usernameField:'email'},(email,password,done)=>{
        user.findOne({email:email})
        .then(user=>{
            if(!user){
                return done(null,false,{message:'Email does not exist'});
            }
            bcrypt.compare(password,user.password,(err,isMatch)=>{
                if(err) throw err;
                if(isMatch){
                    return done(null,user);
                }
                else{
                    return done(null,false,{message:'Incorrect password'});
                }
            })
        })
        .catch(err=>{console.log(err);})
    }))
}

passport.serializeUser((user, done) =>{
  done(null, user.id);
});

passport.deserializeUser((id, done)=> {
  user.findById(id, (err, user)=> {
    done(err, user);
  });
});