const cloudinary = require("../config/clodinary")


const uploadToCloudinary = async (filepath) => {
    try {
        console.log("11");
        
        const result = await cloudinary.uploader.upload(filepath);
        console.log("22");

        return {
            url: result.secure_url,
            publicId: result.public_id
        }
} catch (error) {
        console.error("Error while uploading to cloudinary", error);
        throw new Error("Error while uploading to cloudinary")
    }
}

module.exports = uploadToCloudinary;
