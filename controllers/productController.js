// const Product = require('../models/Product');
// const path = require('path');
// const fs = require('fs');

// // @desc    Get all products
// // @route   GET /api/products
// // @access  Public
// exports.getProducts = async (req, res, next) => {
//   try {
//     const products = await Product.find();
//     // Return just the array instead of an object
//     res.status(200).json(products);
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       error: 'Server Error'
//     });
//   }
// };

// // @desc    Get single product
// // @route   GET /api/products/:id
// // @access  Public
// exports.getProduct = async (req, res, next) => {
//   try {
//     const product = await Product.findById(req.params.id);

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         error: 'Product not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: product
//     });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       error: 'Server Error'
//     });
//   }
// };

// // @desc    Create product
// // @route   POST /api/products
// // @access  Private/Admin
// exports.createProduct = async (req, res, next) => {
//   try {
//     // Handle file upload
//     let image = 'no-image.jpg';
//     if (req.file) {
//       image = req.file.filename;
//     }

//     const product = await Product.create({
//       ...req.body,
//       image
//     });

//     res.status(201).json({
//       success: true,
//       data: product
//     });
//   } catch (err) {
//     if (err.name === 'ValidationError') {
//       const messages = Object.values(err.errors).map(val => val.message);
//       return res.status(400).json({
//         success: false,
//         error: messages
//       });
//     } else {
//       return res.status(500).json({
//         success: false,
//         error: 'Server Error'
//       });
//     }
//   }
// };

// // @desc    Update product
// // @route   PUT /api/products/:id
// // @access  Private/Admin
// exports.updateProduct = async (req, res, next) => {
//   try {
//     let product = await Product.findById(req.params.id);

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         error: 'Product not found'
//       });
//     }

//     // Handle file upload
//     let image = product.image;
//     if (req.file) {
//       // Delete old image if it exists and not the default
//       if (image !== 'no-image.jpg') {
//         const imagePath = path.join(__dirname, '../uploads', image);
//         if (fs.existsSync(imagePath)) {
//           fs.unlinkSync(imagePath);
//         }
//       }
//       image = req.file.filename;
//     }

//     product = await Product.findByIdAndUpdate(
//       req.params.id,
//       {
//         ...req.body,
//         image
//       },
//       {
//         new: true,
//         runValidators: true
//       }
//     );

//     res.status(200).json({
//       success: true,
//       data: product
//     });
//   } catch (err) {
//     if (err.name === 'ValidationError') {
//       const messages = Object.values(err.errors).map(val => val.message);
//       return res.status(400).json({
//         success: false,
//         error: messages
//       });
//     } else {
//       return res.status(500).json({
//         success: false,
//         error: 'Server Error'
//       });
//     }
//   }
// };

// // @desc    Delete product
// // @route   DELETE /api/products/:id
// // @access  Private/Admin
// exports.deleteProduct = async (req, res, next) => {
//   try {
//     const product = await Product.findById(req.params.id);

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         error: 'Product not found'
//       });
//     }

//     // Delete image if it exists and not the default
//     if (product.image !== 'no-image.jpg') {
//       const imagePath = path.join(__dirname, '../uploads', product.image);
//       if (fs.existsSync(imagePath)) {
//         fs.unlinkSync(imagePath);
//       }
//     }

//     await product.remove();

//     res.status(200).json({
//       success: true,
//       data: {}
//     });
//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       error: 'Server Error'
//     });
//   }
// };

// // @desc    Get all categories
// // @route   GET /api/products/categories
// // @access  Public
// exports.getCategories = async (req, res, next) => {
//   try {
//     const categories = await Product.getCategories();
//     res.status(200).json({
//       success: true,
//       data: categories.map(cat => cat._id)
//     });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       error: 'Server Error'
//     });
//   }
// };




const Product = require('../models/Product');
const path = require('path');
const fs = require('fs');

// Helper function to construct image URL
const getImageUrl = (req, filename) => {
  return `${req.protocol}://${req.get('host')}/uploads/${filename}`;
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    
    // Map products to include full image URLs
    const productsWithUrls = products.map(product => ({
      ...product._doc,
      image: getImageUrl(req, product.image)
    }));
    
    res.status(200).json(productsWithUrls);
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // Add full image URL
    const productWithUrl = {
      ...product._doc,
      image: getImageUrl(req, product.image)
    };

    res.status(200).json(productWithUrl);
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No image file provided'
      });
    }

    const product = await Product.create({
      ...req.body,
      image: req.file.filename
    });

    // Construct full URL for the response
    const productWithUrl = {
      ...product._doc,
      image: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
    };

    res.status(201).json(productWithUrl);
  } catch (err) {
    // Error handling remains the same
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // Handle file upload
    let image = product.image;
    if (req.file) {
      // Delete old image if it exists and not the default
      if (image !== 'no-image.jpg') {
        const imagePath = path.join(__dirname, '../uploads', image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
      image = req.file.filename;
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        image
      },
      {
        new: true,
        runValidators: true
      }
    );

    // Return product with full image URL
    const productWithUrl = {
      ...product._doc,
      image: getImageUrl(req, product.image)
    };

    res.status(200).json(productWithUrl);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // Delete image if it exists and not the default
    if (product.image !== 'no-image.jpg') {
      const imagePath = path.join(__dirname, '../uploads', product.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await product.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get all categories
// @route   GET /api/products/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Product.getCategories();
    res.status(200).json(categories.map(cat => cat._id));
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};