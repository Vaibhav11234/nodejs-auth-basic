const express = require("express");
const router = express.Router();
const {registerUser, loginUser,changePassword} = require("../controllers/auth_controller");
const authMiddleware = require("../middleware/auth_middleware");

//all routes
router.post("/login",loginUser);
router.post("/register",registerUser);
router.post("/changePassword",authMiddleware,changePassword)

module.exports = router;