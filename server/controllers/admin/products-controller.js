const { imageUploadUtil } = require("../../helpers/cloudinary");
const Product = require("../../models/Product");

const handleImageUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = `data:${req.file.mimetype};base64,${b64}`;
    const result = await imageUploadUtil(url);

    if (!result) {
      return res.status(500).json({ success: false, message: "Image upload failed" });
    }

    res.json({ success: true, result });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error occurred" });
  }
};

// Utility: normalize sizes into an array of strings
const normalizeSizes = (sizes) => {
  if (!sizes) return [];
  if (Array.isArray(sizes)) {
    return sizes.map((s) => typeof s === "object" ? s.value || s.label : s);
  }
  return [sizes];
};

// Add a new product
const addProduct = async (req, res) => {
  try {
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      averageReview,
      sizes
    } = req.body;

    const newlyCreatedProduct = new Product({
      image,
      title,
      description,
      category,
      brand,
      price: Number(price) || 0,
      salePrice: Number(salePrice) || 0,
      totalStock: Number(totalStock) || 0,
      averageReview: Number(averageReview) || 0,
      sizes: normalizeSizes(sizes)
    });

    await newlyCreatedProduct.save();

    res.status(201).json({ success: true, data: newlyCreatedProduct });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Error occurred" });
  }
};

// Fetch all products
const fetchAllProducts = async (req, res) => {
  try {
    const listOfProducts = await Product.find({});
    res.status(200).json({ success: true, data: listOfProducts });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Error occurred" });
  }
};

// Edit a product
const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      averageReview,
      sizes
    } = req.body;

    let findProduct = await Product.findById(id);
    if (!findProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    findProduct.title = title || findProduct.title;
    findProduct.description = description || findProduct.description;
    findProduct.category = category || findProduct.category;
    findProduct.brand = brand || findProduct.brand;
    findProduct.price = price === "" ? 0 : Number(price) || findProduct.price;
    findProduct.salePrice = salePrice === "" ? 0 : Number(salePrice) || findProduct.salePrice;
    findProduct.totalStock = Number(totalStock) || findProduct.totalStock;
    findProduct.image = image || findProduct.image;
    findProduct.averageReview = Number(averageReview) || findProduct.averageReview;
    findProduct.sizes = sizes ? normalizeSizes(sizes) : findProduct.sizes;

    await findProduct.save();
    res.status(200).json({ success: true, data: findProduct });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Error occurred" });
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Error occurred" });
  }
};

module.exports = {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct
};
