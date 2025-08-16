const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity, size } = req.body;

    // 1️⃣ Basic validation
    if (!userId || !productId || quantity <= 0 || !size) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    // 2️⃣ Fetch product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // 3️⃣ Validate size
    const availableSizes = Array.isArray(product.sizes)
      ? product.sizes.flatMap((s) => s.split(",").map((x) => x.trim()))
      : [];
    if (!availableSizes.includes(size)) {
      return res.status(400).json({
        success: false,
        message: `Selected size "${size}" is not available for this product.`,
      });
    }

    // 4️⃣ Stock check
    if (quantity > product.totalStock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.totalStock} items available in stock.`,
      });
    }

    // 5️⃣ Find or create cart
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // 6️⃣ Check if same product + size already exists
    const findCurrentProductIndex = cart.items.findIndex(
      (item) =>
        item.productId.toString() === productId.toString() &&
        item.size === size
    );

    if (findCurrentProductIndex === -1) {
      // Push new cart item with stored product details
      cart.items.push({
        productId,
        productName: product.title,
        quantity,
        size,
        price: product.price,
        image: product.image, // Assuming "image" is the main image field
      });
    } else {
      // Increase quantity with stock check
      const newQuantity =
        cart.items[findCurrentProductIndex].quantity + quantity;
      if (newQuantity > product.totalStock) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.totalStock} items available in stock.`,
        });
      }
      cart.items[findCurrentProductIndex].quantity = newQuantity;
    }

    // 7️⃣ Save cart
    await cart.save();

    // 8️⃣ Send updated cart
    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.error("Add to Cart Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding to cart",
    });
  }
};



const fetchCartItems = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User id is mandatory!",
      });
    }

    const cart = await Cart.findOne({ userId })
      .populate({
        path: "items.productId",
        select: "image title price salePrice",
      })
      .lean(); // prevents Mongoose from stripping custom fields like size

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    // Filter only valid items
    const validItems = cart.items.filter((productItem) => productItem.productId);

    // Build clean cart items list with size preserved
    const populateCartItems = validItems.map((item) => ({
      productId: item.productId._id,
      image: item.productId.image,
      title: item.productId.title,
      price: item.productId.price,
      salePrice: item.productId.salePrice,
      quantity: item.quantity,
      size: item.size || null, // ensure size is included
    }));

    res.status(200).json({
      success: true,
      data: {
        _id: cart._id,
        userId: cart.userId,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching cart items",
    });
  }
};


const updateCartItemQty = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (findCurrentProductIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Cart item not present !",
      });
    }

    cart.items[findCurrentProductIndex].quantity = quantity;
    await cart.save();

    await cart.populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      title: item.productId ? item.productId.title : "Product not found",
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    // Filter items safely, even if productId is null
    cart.items = cart.items.filter(
      (item) =>
        item.productId &&
        item.productId._id.toString() !== productId.toString()
    );

    await cart.save();

    await cart.populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    const populatedCartItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      title: item.productId ? item.productId.title : "Product not found",
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: populatedCartItems, // ✅ return only array to match frontend expectation
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error deleting cart item",
    });
  }
};


module.exports = {
  addToCart,
  updateCartItemQty,
  deleteCartItem,
  fetchCartItems,
};
