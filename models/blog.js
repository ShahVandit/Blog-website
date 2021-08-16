var mongoose=require('mongoose');
var schema1=mongoose.Schema({
    author:{
        type:String,
        required:true
    },
    topic:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
});

var blog=mongoose.model('Blogs',schema1);
module.exports=blog;