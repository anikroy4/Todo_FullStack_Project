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
    // console.log(token);
   
    try {
        const decoded=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        const userExists=await User.findById(decoded.id);

        if (!userExists){
            return res.send({error: "Invalid Token"})
        }
        userExists.isVarified = true;

        userExists.save()
        res.send({message: "Email Verified Successfully."})

        
    } catch (error) {
        res.send({error: "Invalid Token or Experied."})
    }
    
    

        


}

    let loginController= async(req, res)=>{
            res.send("Login Here");
            const {email, password}=req.body
            const userExists=await User.findOne({email:email});
            if (!userExists){
            return res.send({error: "Invalid Credential"});

            }
            if (!userExists.isVarified){
                return res.send({error: "Please Verify Your Email."});

            }

        const isPasswordMatch= await bcryptjs.compare(password,userExists.password);
        if (!isPasswordMatch){
            return res.send({error: "Invalid Credential"})
        }

        const accessToken=generateAccessToken(userExists);
        const refreshToken=generateRefreshToken(userExists);
        userExists.refreshToken=refreshToken;

        await userExists.save();

        res.cookie("refreshToken",refreshToken,{
            httpOnly:true,
            secure: false,
            sameSite: "strict",
            maxAge: 7*24*60*60*1000     //7 days validation
        
        })
        res.send({
            message: "Login Successful",
            accessToken: accessToken,
            username: userExists.username,
            email: userExists.email,
        })

    }

    const refreshController=async(req, res)=>{
        const token=req.cookies.refreshToken;
        if(!token){
            return res.send ({error: "No Token Found"})
            
        }
        const userExists=await User.findOne({refreshToken:token});
        if (!userExists){
            return res.send({error: "Invalid Token"})
        }
        jwt.verify(token,process.env.REFRESH_TOKEN_SECRET,(error,decoded)=>{
            if (error){
                return res.send({error: "Invalid Token"})
            }
            const accessToken=generateAccessToken(userExists);
            res.send({accessToken})
        })

    
    }
    const forgotPasswordController=async(req, res)=>{
        const {email}=req.body;
        const userExists=await User.findOne({email:email});
        if (!userExists){
            return res.send({error: "User not found"})
        }
        const resetToken=jwt.sign({id:userExists._id},process.env.ACCESS_TOKEN_SECRET,{expiresIn:"15m"})
        const resetLink=`${process.env.CLINT_URL}/reset-password/${resetToken}`
         await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject:`Reset Password`, 
            html:`<h4> Click to reset password.
            <a href='${resetLink}'>Reset Password</a></h4>  `
        })
        res.send({massage: "Please check email to reset password."})
    }
    const resetPasswordController=async(req, res)=>{
        const token=req.params.token;
        const {password}=req.body;
        try {
            const decoded=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
            const userExists=await User.findById(decoded.id);
            if (!userExists){
                return res.send({error: "Invalid Token"})
            }
            userExists.password=await bcryptjs.hash(password,10);
            await userExists.save();
            res.send({message: "Password Reset Successfully"})

        } catch (error) {
            res.send({error: "Invalid Token or Experied."})
        }

    }
        


module.exports={
    registrationController,
    loginController,
    verificationTokenController,
    refreshController,
    forgotPasswordController,
    resetPasswordController


}