const mongoose = require("mongoose");
require("dotenv").config();



const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URL)
        .then(()=>{
            console.log("Database connected successfully");
        })
        
    }
    catch(error){
        console.log(error.message);
    }
}
module.exports = connectDB;