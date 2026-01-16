const mongoose = require("mongoose");
const MONGO_URL = process.env.MONGO_URL;

const connectToDB = async ()=>{
    await mongoose.connect(MONGO_URL).then(
        ()=> console.log("Database connected successfully")
    ).catch((e)=>{
        console.log("Database connection failed",e);
        process.exit(1);
    })
}

module.exports = connectToDB;