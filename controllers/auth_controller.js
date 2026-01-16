const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//register user controller
const registerUser = async (req, res) => {

    try {
        //extract user info req body
        const { username, email, password, role } = req.body;
        //check user is already exist in our db.
        const userExisted = await User.findOne({ $or: [{ username }, { password }] });
        console.log("1");
        
        if (userExisted) {
            return res.status(409).json({
                success: false,
                message: "User already existed in database either username or email, try with different username or email"
            })
        }
        console.log("2");
        //hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log("3",hashedPassword);

        const newlyCreatedUser = new User({
            username,
            email,
            password : hashedPassword,
            role: role || 'user'
        })
        console.log("4");

        console.log(newlyCreatedUser);
        
        await newlyCreatedUser.save();
        if (newlyCreatedUser) {
            res.status(201).json({
                message: "New User created successfully",
                success: true
            })
        } else {
            res.status(400).json({
                message: "Unable to register user, please try again",
                success: false
            })
        }
        console.log("5");

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Some issue found, please try again",
            error: error
        })
    }
}

// login user controller
const loginUser = async (req, res) => {
    try {
       const {email,password} = req.body;

       //check same email which is unique is present or not in db
       const user = await User.findOne({email});

       if(!user){
        return res.status(400).json({
            success: false,
            message : "User does not exist"
        })
       }

       //check password enter by user is same or not for saved user password
       const passwordMatched = await bcrypt.compare(password,user.password);

       if(!passwordMatched){
         return res.status(400).json({
            success: true,
            message : "Invalid Credentials"
        })
       }

       //create user token 
       const accessToken = jwt.sign({
        userId : user._id,
        email: user.email,
        role: user.role
       },process.env.JWT_SECRET_KEY,{
        expiresIn : "15m"
       })

       res.status(200).json({
        success: true,
        message: "Logged In Successfully",
        accessToken: accessToken
       })




    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something wrong, please try again",
            success: false,
            error: error
        })

    }
}

// change password
const changePassword = async(req,res)=>{
    try {
        const {userId} = req.userInfo;

        const {oldPassword,newPassword} = req.body;

        // const user = await User.findById({_id:userId});
        //same as
        const user = await User.findById(userId);

        if(!user){
            return res.status(400).json({
                success: false,
                message:"No user Found."
            })
        }

        //check old password is correct
        const oldPasswordCorrectorNot = bcrypt.compare(oldPassword, user.password);

        if(!oldPasswordCorrectorNot){
            return res.status(400).json({
                success: false,
                message: "Old password doesn't match"
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        res.status(200).json({
            success:true,
            message:"Password changed successfully",
        })
    } catch (error) {
         console.log(error);
        res.status(500).json({
            message: "Something wrong, please try again",
            success: false,
            error: error
        })
    }
}

module.exports = { loginUser, registerUser, changePassword};