const mongoose=require('mongoose');
const { required } = require('nodemon/lib/config');

const userProfile=new mongoose.Schema({
    userName:{
        type:String,
        require:true
    },
    userBio:{
        type:String,
        require:true
    },
    userImage:{
        type:String,
        require:true
    },
    userId:{
        type:String,
    }
    
})

module.exports=mongoose.model("userProfile",userProfile);