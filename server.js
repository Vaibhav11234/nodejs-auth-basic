require('dotenv').config();
const express = require("express");
const connectToDB = require("./database/db");
const authRoutes = require("./routes/auth_routes") 
const homeRoutes = require("./routes/home_routes")
const adminRoutes = require("./routes/admin_routes")
const imageRoutes = require("./routes/image_routes")

connectToDB();
const PORT = process.env.PORT || 3000;

const app = express();

//middle wares
app.use(express.json());

app.use("/api/auth",authRoutes);
app.use("/api/home",homeRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/image",imageRoutes);


app.listen(PORT,()=>{
    console.log(`Server is now listening to port ${PORT}`);
})