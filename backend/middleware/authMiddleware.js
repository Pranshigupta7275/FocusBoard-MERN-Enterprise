import jwt from 'jsonwebtoken';
import User from "../models/User.js";

// Guard: Verify if the user is authenticated via Header OR Cookie
export const protect = async (req, res, next) => {
  let token;

  // 1. FIRST PRIORITY: Look for the token in the Headers (Bypasses Incognito cookie blockers!)
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } 
  // 2. SECOND PRIORITY: Fallback to the cookie (if the header is missing)
  else if (req.cookies.token) {
    token = req.cookies.token;
  }

  // 3. IF NO TOKEN FOUND AT ALL
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Not authorized, no token provided' 
    });
  }

  try {
    // 4. Verify the token using your environment variable secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Find the user by ID and attach to request object (excluding password)
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