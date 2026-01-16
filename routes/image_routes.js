const express = require("express");
const authMiddleware = require("../middleware/auth_middleware");
const adminMiddleware = require("../middleware/admin_middleware");
const uploadMiddleware = require("../middleware/upload_middleware");

const {uploadImageController,fetchImagesController,deleteImageController} = require("../controllers/image_controller");

const router = express.Router();

router.post("/upload",authMiddleware,adminMiddleware,uploadMiddleware.single("image"),uploadImageController);

//to get all the images
router.get("/get", authMiddleware, fetchImagesController);

//delete image route
router.delete("/:id", authMiddleware, adminMiddleware, deleteImageController);

module.exports = router;