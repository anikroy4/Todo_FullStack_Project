const jwt=require("jsonwebtoken");
const bcryptjs=require("bcryptjs");
const User=require("../model/userModel");
const nodemailer=require("nodemailer");

const transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,

    } 
})




const generateAccessToken=(user)=>{
return jwt.sign({id:user._id},process.env.ACCESS_TOKEN_SECRET,{expiresIn:"15m"})
}
const generateRefreshToken=(user)=>{
return jwt.sign({id:user._id},process.env.REFRESH_TOKEN_SECRET,{expiresIn:"365d"})
}




let registrationController=async( req, res)=>{
    const {username, email, password}=req.body;

    // Username email password validation Starts

    // Username email password validation Ends
    const userExists=await User.findOne({email:email});
    if(userExists){
        return res.send({error: `${email} already exists`})
    }
    
    const hashed=await bcryptjs.hash(password,10);
    

    const user= new User({
        username:username,
        email : email,
        password:hashed,
        isVarified:false,
    });

    try {
        await user.save();
        const verificationToken=jwt.sign({id:user._id},process.env.ACCESS_TOKEN_SECRET,{expiresIn:"15m"})
        const VerifyLink=`${process.env.CLINT_URL}/verify/${verificationToken}`
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject:`${user.username} please verify your email`, 
            html:`<h4>  ${user.username} please verify your email.
            <a href='${VerifyLink}'>Verify Mail</a></h4>  `
        })
        res.send({message:" Registration successful. please check email"});
        
    } catch (error) {
        console.log("while trying to save in database",error);
        
        // res.send({error: `tintinatin already exists`})
        
    }

    
}
let verificationTokenController= async(req, res)=>{
    // res.send("Verify Here"); 
    const {token} =req.params 
    console.log(token);
    
    try {
        const decoded=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        console.log(decoded);
        
    } catch (error) {
        
    }
    
    

        


}

    let loginController=(req, res)=>{
    res.send("Login Here");
        
    }


module.exports={
    registrationController,
    loginController,
    verificationTokenController

}