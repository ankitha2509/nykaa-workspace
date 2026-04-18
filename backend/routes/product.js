const express = require("express");
const router = express.Router();

const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const Product = require("../models/Product");

const storage = multer.memoryStorage();
const upload = multer({ storage });

// ================================
// ADD PRODUCT (FIXED)
// ================================

router.post("/add", upload.single("image"), async (req, res) => {
  try {

    console.log("ADD PRODUCT HIT");

    let imageUrl = "";

    // upload image to cloudinary
    if (req.file) {

      const streamUpload = (buffer) => {
        return new Promise((resolve, reject) => {

          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "nykaa-products"
            },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );

          stream.end(buffer);
        });
      };

      const result = await streamUpload(req.file.buffer);
      imageUrl = result.secure_url;
    }

    const product = new Product({
      name: req.body.name,
      brand: req.body.brand,
      category: req.body.category,
      price: req.body.price,
      stock: req.body.stock,
      description: req.body.description,
      image: imageUrl
    });

    await product.save();

    res.json({
      success: true,
      message: "Product added successfully"
    });

  } catch (error) {
    console.log("ADD ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;