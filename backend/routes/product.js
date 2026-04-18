const express = require("express");
const router = express.Router();

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const cloudinary = require("../config/cloudinary");
const Product = require("../models/Product");


// ================================
// CLOUDINARY STORAGE
// ================================

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "nykaa-products",
    allowed_formats: ["jpg", "png", "jpeg", "webp"]
  }
});

const upload = multer({ storage });


// ================================
// ADD PRODUCT
// ================================

router.post("/add", upload.single("image"), async (req, res) => {
  try {

    const product = new Product({
      name: req.body.name,
      brand: req.body.brand,
      category: req.body.category,
      price: req.body.price,
      stock: req.body.stock,
      description: req.body.description,
      image: req.file ? req.file.path : ""
    });

    await product.save();

    res.json({
      success: true,
      message: "Product added successfully"
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error adding product"
    });
  }
});


// ================================
// GET ALL PRODUCTS
// ================================

router.get("/all", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
});


// ================================
// DELETE PRODUCT
// ================================

router.delete("/delete/:id", async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // delete image from cloudinary
    if (product.image) {

      const arr = product.image.split("/");
      const file = arr[arr.length - 1];
      const publicId =
        "nykaa-products/" + file.split(".")[0];

      await cloudinary.uploader.destroy(publicId);
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Product deleted successfully"
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Delete failed"
    });
  }
});


// ================================
// UPDATE PRODUCT
// ================================

router.put("/update/:id", upload.single("image"), async (req, res) => {
  try {

    const oldProduct = await Product.findById(req.params.id);

    if (!oldProduct) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    let imageUrl = oldProduct.image;

    if (req.file) {

      if (oldProduct.image) {
        const arr = oldProduct.image.split("/");
        const file = arr[arr.length - 1];
        const publicId =
          "nykaa-products/" + file.split(".")[0];

        await cloudinary.uploader.destroy(publicId);
      }

      imageUrl = req.file.path;
    }

    await Product.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      brand: req.body.brand,
      category: req.body.category,
      price: req.body.price,
      stock: req.body.stock,
      description: req.body.description,
      image: imageUrl
    });

    res.json({
      success: true,
      message: "Product updated successfully"
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Update failed"
    });
  }
});

module.exports = router;