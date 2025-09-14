const mongoose = require('mongoose');

let databaseConfig=()=>{
    mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log("Database Connected");
        
    }).catch(error=>{
        console.log("Database Connection Error",error);
    })

}
module.exports=databaseConfig;