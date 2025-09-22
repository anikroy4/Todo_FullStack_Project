const express = require('express');
const router =express.Router();
const { registrationController, loginController, verificationTokenController, refreshController}=require("../controller/authController");


 


router.post("/registration",registrationController);
router.post("/verify/:token",verificationTokenController);
    
router.post("/login",loginController);
router.post("/refresh",refreshController);
    


module.exports=router;