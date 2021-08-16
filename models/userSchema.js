const mongoose =require('mongoose');
// Defining schema
var schema=mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
    type:String,
    required:true
    },
    name:{
    type:String,
    required:true     
    },
    date:{
        type:Date,
        default:Date.now
    }

});

const users=mongoose.model('User',schema);
module.exports=users;