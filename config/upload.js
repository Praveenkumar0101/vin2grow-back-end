const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Add null check for file.originalname
    const ext = path.extname(file.originalname || '');
    cb(null, `product-${Date.now()}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Add null checks for file properties
  if (!file || !file.originalname || !file.mimetype) {
    return cb(new Error('Invalid file upload'), false);
  }

  const filetypes = /jpe?g|png|gif|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Only images (jpeg, jpg, png, gif, webp) are allowed'), false);
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter
}).single('image'); // This must match your Postman field name

module.exports = upload;