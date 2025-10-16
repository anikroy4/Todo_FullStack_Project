const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const authRoutes = require('./routes/authRoutes');
const databaseConfig = require('./config/databaseConfig');
const cors = require('cors');
const app = express();


//local Host:8000/api/auth/
 
databaseConfig();
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));

app.use(express.json());

app.use("/api/auth", authRoutes );


app.listen(8000,()=>{
    console.log("Server is Running");
    
})