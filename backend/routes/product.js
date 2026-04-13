const express = require("express");
const router = express.Router();
const multer = require("multer");
const Product = require("../models/Product");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/add", upload.single("image"), async (req, res) => {
  try {

    const newProduct = new Product({
      name: req.body.name,
      brand: req.body.brand,
      category: req.body.category,
      price: req.body.price,
      stock: req.body.stock,
      description: req.body.description,
      image: req.file ? req.file.path : "",
    });

    await newProduct.save();

    res.json({ message: "Product added successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error adding product" });
  }
});

router.get("/all", async (req, res) => {
  try {

    const products = await Product.find();
    res.json(products);

  } catch (err) {
    res.status(500).json({ message: "Error fetching products" });
  }
});

router.get("/:id", async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);
    res.json(product);

  } catch (err) {
    res.status(500).json({ message: "Error fetching product" });
  }
});

router.put("/update/:id", upload.single("image"), async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updateData = {
      name: req.body.name,
      brand: req.body.brand,
      category: req.body.category,
      price: req.body.price,
      stock: req.body.stock,
      description: req.body.description,
    };

    if (req.file) {
      if (product.image) {
        const oldImagePath = path.join(__dirname, "..", product.image);

        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      updateData.image = req.file.path;
    }

    await Product.findByIdAndUpdate(req.params.id, updateData);

    res.json({ message: "Product updated successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating product" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.image) {

      const imagePath = path.join(__dirname, "..", product.image);

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: "Product and image deleted successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error deleting product" });
  }
});

module.exports = router;