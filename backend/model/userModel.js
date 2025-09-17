const mongoose = require('mongoose');
const { Schema }= mongoose;

const userSchema= new Schema({
    username:String,
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        refreshToken: String,
    
    }

})

module.exports=mongoose.model("User",userSchema);