const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: [0, 'Price cannot be negative']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot be more than 100%']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    trim: true
  },
  image: {
    type: String,
    default: 'no-image.jpg'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Static method to get all categories
ProductSchema.statics.getCategories = async function() {
  return await this.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);
};

module.exports = mongoose.model('Product', ProductSchema);