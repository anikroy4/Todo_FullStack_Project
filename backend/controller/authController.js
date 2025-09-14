let registrationController=( req, res)=>{
    res.send("Registration Here");
    
}
let loginController=(req, res)=>{
   res.send("Login Here");
    
}


module.exports={
    registrationController,
    loginController
}