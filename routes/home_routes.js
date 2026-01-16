const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth_middleware");

router.get("/welcome",authMiddleware,(req,res)=>{
    const {email, userId, role} = req.userInfo;
    res.json({
        message: "Welcome to Home Page",
        user :{
            _id : userId,
            email:email,
            role : role
        }
    })
});

module.exports = router;