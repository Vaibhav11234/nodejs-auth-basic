const Image = require("../models/image");
const uploadToCloudinary = require("../helpers/cloudinaryhelpers")
const fs = require("fs");
const cloudinary = require("../config/clodinary");

const uploadImageController = async (req, res) => {
    try {
        //check if file is missing in req object
        console.log("1");

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "File is missing, Please upload an image"
            })
        }
        console.log("2");

        //upload to clodinary
        const { url, publicId } = await uploadToCloudinary(req.file.path)

        //store the imageurl and public along with uploader user id in db
        const newlyUploadedImage = new Image({
            url: url,
            publicId: publicId,
            uploadedBy: req.userInfo.userId
        })
        console.log("3");

        await newlyUploadedImage.save();

        //delete the file from local storage
        // fs.unlinkSync(req.file.path)

        res.status(201).json({
            success: true,
            message: "Image Uploaded Successfully",
            image: newlyUploadedImage
        })

    } catch (error) {
        console.error("Error: ", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong,-in image controller please try again"
        })
    }
}

const fetchImagesController = async (req, res) => {
    try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;
    const skip = (page - 1) * limit;

    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const totalImages = await Image.countDocuments();
    const totalPages = Math.ceil(totalImages / limit);

    const sortObj = {};
    sortObj[sortBy] = sortOrder;
    const images = await Image.find().sort(sortObj).skip(skip).limit(limit);

    if (images) {
      res.status(200).json({
        success: true,
        currentPage: page,
        totalPages: totalPages,
        totalImages: totalImages,
        data: images,
      });
    }
  } catch (error) {
        console.error("Error: ", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong,-in image controller, please try again"
        })
    }
}

const deleteImageController = async (req, res) => {
    try {
        const idOfImageToBeDelete = req.params.id;
        const {userId} = req.userInfo;

        const image = await Image.findById(idOfImageToBeDelete);

        if(!image){
            return res.status(404).json({
                success: false,
                message :"Image not found."
            })
        }

        if(image.uploadedBy.toString() !== userId){
            return res.status(403).json({
                success:false,
                message:"Yor are not authorized, because you don't uploaded that image"
            })
        }

        //first delete from cloudinary
        cloudinary.uploader.destroy(image.publicId);

        //now delete from db
        await Image.findByIdAndDelete(idOfImageToBeDelete);

        res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });


    } catch (error) {
        console.error("Error: ", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong,-in image controller, please try again"
        })
    }
}

module.exports = {
    uploadImageController,
    fetchImagesController,
    deleteImageController,
};

