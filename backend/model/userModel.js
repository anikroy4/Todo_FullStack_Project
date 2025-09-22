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
    
    },
    isVarified:{
        type:Boolean,
        default:false,
    },
    refreshToken:{
        type:String,
       default:"",
    }
    

})

module.exports=mongoose.model("User",userSchema);