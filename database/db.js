const mongoose = require("mongoose");
const MONGO_URL = process.env.MONGO_URL;

const connectToDB = async ()=>{
    await mongoose.connect("mongodb+srv://vaibhavghadge42_db_user:vaibhavghadge44_db_user@cluster0.ashbcz9.mongodb.net/").then(
        ()=> console.log("Database connected successfully")
    ).catch((e)=>{
        console.log("Database connection failed",e);
        process.exit(1);
    })
}

module.exports = connectToDB;