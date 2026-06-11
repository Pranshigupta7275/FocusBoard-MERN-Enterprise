import jwt from 'jsonwebtoken';
import User from "../models/User.js";

// Guard: Verify if the user is authenticated via cookie
export const protect = async (req, res, next) => {
  // 1. Read the token from the 'token' cookie (matches res.cookie("token", ...))
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Not authorized, no token provided' 
    });
  }

  try {
    // 2. Verify the token using your environment variable secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Find the user by ID and attach to request object (excluding password)
    // Note: ensure 'decoded.id' matches the field used in your generateToken service
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    next(); // Move to the next middleware or controller
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};

// Guard: Check if the user has 'admin' role
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next(); 
  } else {
    res.status(403).json({ 
      success: false, 
      message: 'Access denied. Not authorized as an admin.' 
    });
  }
};