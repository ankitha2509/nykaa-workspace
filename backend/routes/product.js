const express = require("express");
const router = express.Router();

const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const Product = require("../models/Product");

const storage = multer.memoryStorage();
const upload = multer({ storage });

/* =================================
   ADD PRODUCT
================================= */
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    let imageUrl = "";

    // upload image to cloudinary
    if (req.file) {
      const streamUpload = (buffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "nykaa-products" },
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
      category: req.body.category?.trim(), // ✅ FIXED
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
    console.log("ADD PRODUCT ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


/* =================================
   GET ALL PRODUCTS
================================= */
router.get("/all", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error fetching products"
    });
  }
});


/* =================================
   DELETE PRODUCT
================================= */
router.delete("/delete/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
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


/* =================================
   UPDATE PRODUCT
================================= */
router.put("/update/:id", upload.single("image"), async (req, res) => {
  try {
    const oldProduct = await Product.findById(req.params.id);

    if (!oldProduct) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    let imageUrl = oldProduct.image;

    // if new image uploaded
    if (req.file) {
      const streamUpload = (buffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "nykaa-products" },
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

    await Product.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      brand: req.body.brand,
      category: req.body.category?.trim(), // ✅ FIXED
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
    console.log("UPDATE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Update failed"
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.json(product);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error fetching product"
    });
  }
});

module.exports = router;