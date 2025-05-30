const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories
} = require('../controllers/productController');
const upload = require('../config/upload');

// Public routes
router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/:id', getProduct);

// Protected routes (add your auth middleware here)
router.post('/', upload, createProduct);
router.put('/:id', upload, updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;