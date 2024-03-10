const userSchema=require("../models/userSchema");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");

require('dotenv').config();


 const login=async(req,res)=>{
    try {
      
        const {email,password}=req.body;

        //validation on email and password
         if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"please fill all the details carefully"
            })
         }
8

         //checking for register user
         let user =await userSchema.findOne({email});
         //if not a register user

         if(!user){
            return res.status(400).json({
                success:false,
                message:"User is not registerd"
            })
         }

         const payload={
            email:user.email,
            id:user._id,
            role:user.role
         }

         if( await bcrypt.compare(password,user.password)){
            //password matched 


                 //CREATING TOKEN 
                let token =jwt.sign(payload,process.env.SECRET_KEY,
                {
                    expiresIn:"2h"
                })


                user=user.toObject();
                user.token=token;
                user.password=undefined; 


                const options={ //OPTION FOR PASSING IN COOKIES
                    expiresIn:new Date(Date.now()+ 30*24*60*60*1000),
                    httpOnly:true,
                }

                // CREATING COOKIE AND STORING DATA INTO IT
                res.cookie("token",token,options).status(200);

                res.json({
                    success:true,
                    token,
                    user,
                    message:"User LOgged IN Successfully"
                })
             }

         else{
            return res.status(403).json({
                success:false,
                message:"password incorrect"
            })
         }

        
    } catch (error) {
        console.log("Error");
        console.error(error);
    }
}

module.exports=login;