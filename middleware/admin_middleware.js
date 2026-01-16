const isAdminUser = (req,res,next)=>{

    if(req.userInfo.role !== "admin"){
        return res.status(403).json({
            success: false,
            message: "Dont have an access to the current page,Login with admin"
        })
    }
    next();
}

module.exports = isAdminUser;