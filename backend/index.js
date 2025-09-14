const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const authRoutes = require('./routes/authRoutes');
const databaseConfig = require('./config/databaseConfig');
const app = express();


//local Host:8000/api/auth/
 
databaseConfig();

app.use(express.json());

app.use("/api/auth", authRoutes );


app.listen(8000,()=>{
    console.log("Server is Running");
    
})