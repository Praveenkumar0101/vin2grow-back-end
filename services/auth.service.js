const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  // Verify secret key is loaded
  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error('JWT secret not configured');
  }

  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '7d' } // Token expires in 1 hour
  );
};

module.exports = { generateToken };