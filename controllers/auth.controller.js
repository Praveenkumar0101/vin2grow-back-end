// controllers/auth.controller.js
const { generateToken } = require('../services/auth.service');
const User = require('../models/User');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const axios = require('axios');

exports.register = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    
    const token = generateToken(user);
    res.status(201).json({ 
      user: { _id: user._id, email: user.email, role: user.role },
      token 
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// exports.login = async (req, res) => {
//   try {
//     const user = await User.findOne({ email: req.body.email });
//     console.log("user", user);
    
//     if (!user || !(await user.comparePassword(req.body.password))) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     const token = generateToken(user);
//     res.json({ 
//       user: { _id: user._id, email: user.email, role: user.role },
//       token 
//     });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user);
    res.json({ 
      user: { _id: user._id, email: user.email, role: user.role },
      token 
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};







exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    res.json({ message: 'Token generated', token }); // Send token to frontend
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};



exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ error: 'Invalid or expired token' });

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    res.json({ message: 'Password has been reset' });
  } catch (err) {
      console.error('Error resetting password:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
