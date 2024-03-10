const mongoose=require('mongoose');

const postSchema=new mongoose.Schema({

    title:{
        type:String,
        required:true,
    },
    body:{
        type:String,
        require:true
    },

    userId:{
        type:String
    },

    createdAt: {
        type: Date,
        default: Date.now // Set default value to the current date and time when the document is first created
    },
    updatedAt: {
        type: Date,
        default: Date.now // Set default value to the current date and time when the document is first created or updated
    }
    
    
       

});

module.exports=mongoose.model('Posts',postSchema);
