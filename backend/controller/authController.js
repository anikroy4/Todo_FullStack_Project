const jwt=require("jsonwebtoken");
const bcryptjs=require("bcryptjs");
const User=require("../model/userModel");



const generateAccessToken=(user)=>{
return jwt.sign({id:user._id},process.env.ACCESS_TOKEN_SECRET,{expiresIn:"15m"})
}
const generateRefreshToken=(user)=>{
return jwt.sign({id:user._id},process.env.REFRESH_TOKEN_SECRET,{expiresIn:"365d"})
}




let registrationController=async( req, res)=>{
    const {username, email, password}=req.body;
    const hashed=await bcryptjs.hash(password,10);

    const user= new User({
        username:username,
        email : email,
        password:String,
        isVarified:false,
    });
    user.save();

    res.send({message:" Registration successful. please check email"});
    
}
let loginController=(req, res)=>{
   res.send("Login Here");
    
}


module.exports={
    registrationController,
    loginController
}