import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";

const protect = async (req, res, next) => {
  let token = null;

  // 1. Prefer Authorization: Bearer header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // 2. Fall back to HttpOnly cookie
  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new ApiError(401, "Not authorized, no token provided"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return next(new ApiError(401, "User belonging to this token no longer exists"));
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new ApiError(401, "Token expired, please login again"));
    }
    if (error.name === "JsonWebTokenError") {
      return next(new ApiError(401, "Invalid token, please login again"));
    }
    return next(new ApiError(401, "Not authorized, token verification failed"));
  }
};

export default protect;