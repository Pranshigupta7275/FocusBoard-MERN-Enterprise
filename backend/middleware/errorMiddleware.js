export function notFound(req, res, next) {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
}

// Centralized error handler. All controller errors (ApiError instances as
// well as Mongoose validation/cast errors) are funneled through here so the
// task API never returns ad-hoc response shapes.
export function errorHandler(err, req, res, next) {
  // Mongoose validation errors -> 400 with field-level details.
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors || {}).map((e) => ({
      field: e.path || "unknown",
      message: e.message,
    }));
    return res.status(400).json({
      success: false,
      message: err.message || "Validation error",
      statusCode: 400,
      data: null,
      errors,
      stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
  }

  // Mongoose cast errors (e.g. invalid ObjectId or date) -> 400.
  if (err.name === "CastError" || err.kind === "ObjectId") {
    return res.status(400).json({
      success: false,
      message: "Invalid request data",
      statusCode: 400,
      data: null,
      errors: [],
      stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
  }

  const statusCode =
    err.statusCode ||
    (res.statusCode === 200 ? 500 : res.statusCode) ||
    500;

  res.status(statusCode);
  res.json({
    success: false,
    message: err.message || "Internal server error",
    statusCode,
    data: err.data !== undefined ? err.data : null,
    errors: Array.isArray(err.errors) ? err.errors : [],
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
}
