const mongoose=require('mongoose');

require('dotenv').config();

const dbConnect=async()=>{
    try {
        mongoose.connect(process.env.DATABASE_URL);
        console.log("|| Db Connected ||");
        
    } catch (error) {
        console.log(error);
        console.error("SomeThing Error");
    }
}

module.exports=dbConnect;