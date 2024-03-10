const jwt =require("jsonwebtoken");
require("dotenv").config();

exports.auth=(req,res,next)=>{
    try {
        
        const token=req.cookies.token || req.body.token || req.header("Authorisation").replace("Bearer ", "");
        
        if(!token){
            return res.status(401).json({
                success:false,
                message:"User Is not Logged In"
            })
        }
        
        try{
            //VERIFYING TOKEN USEING SECREATE KEY
            const decode =jwt.verify(token,process.env.SECRET_KEY);
            // console.log(decode);
            req.user=decode; //STORING DECODED DATA ON AUTH REQ

            // console.log("printing req.user=decode",req.user.id);

        } catch(error){
            return res.status(401).json({
                success:false,
                    message:"token is invalid"
            })
        }

        next(); //AUTOMATICALLY GOSE TO NEXT MIDDELWARE

    } catch (error) {
        return res.status(401).json({ 
            success:false,
                message:"Somthing went wrong while verifiying the token",
                error:error
        })
    }
}
