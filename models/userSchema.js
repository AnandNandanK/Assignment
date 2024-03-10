const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    
    userProfile:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'UserProfile'
    }],

    posts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Posts'
    }],
       
    followers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'userSchema'
    }],
    
    following:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'userSchema'
    }]
    
})


module.exports=mongoose.model("userSchema",userSchema);