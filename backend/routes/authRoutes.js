const express = require('express');
const router =express.Router();
const { registrationController, loginController, verificationTokenController, refreshController, forgotPasswordController,resetPasswordController}=require("../controller/authController");


 


router.post("/registration",registrationController);
router.get("/verify/:token",verificationTokenController);
    
router.post("/login",loginController);
router.post("/refresh",refreshController);
router.post("/forgot-password",forgotPasswordController);
router.post("/reset-password/:token",resetPasswordController);
    


module.exports=router;