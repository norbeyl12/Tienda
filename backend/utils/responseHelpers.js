// Response utility functions
const createSuccessResponse = (data, message = "Success", total = null) => {
  const response = {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };

  if (total !== null) {
    response.total = total;
  }

  return response;
};

const createErrorResponse = (
  error,
  message = "An error occurred",
  statusCode = 500
) => {
  return {
    success: false,
    error: error instanceof Error ? error.message : error,
    message,
    statusCode,
    timestamp: new Date().toISOString(),
  };
};

// Pagination utility
const paginate = (array, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  const paginatedItems = array.slice(offset, offset + limit);

  return {
    data: paginatedItems,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: array.length,
      totalPages: Math.ceil(array.length / limit),
      hasNext: offset + limit < array.length,
      hasPrev: page > 1,
    },
  };
};

// Search utility
const searchArray = (array, searchTerm, searchFields) => {
  if (!searchTerm || !searchTerm.trim()) {
    return array;
  }

  const term = searchTerm.toLowerCase().trim();

  return array.filter((item) => {
    return searchFields.some((field) => {
      const value = item[field];
      if (value === null || value === undefined) return false;
      return String(value).toLowerCase().includes(term);
    });
  });
};

// Database error handler
const handleDatabaseError = (error, operation = "database operation") => {
  console.error(`❌ ${operation} failed:`, error);

  // Common SQL Server error handling
  if (error.code === "ELOGIN") {
    return createErrorResponse(
      "Database authentication failed",
      "Please check database credentials",
      401
    );
  }

  if (error.code === "ETIMEOUT") {
    return createErrorResponse(
      "Database connection timeout",
      "Database server is not responding",
      504
    );
  }

  if (error.code === "ECONNREFUSED") {
    return createErrorResponse(
      "Database connection refused",
      "Database server is not available",
      503
    );
  }

  // Generic error
  return createErrorResponse(
    error.message || "Database error occurred",
    `Failed to perform ${operation}`,
    500
  );
};

// Validation utilities
const validateRequired = (obj, requiredFields) => {
  const missing = requiredFields.filter((field) => !obj[field]);
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(", ")}`);
  }
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Logging utility
const logRequest = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`
    );
  });

  next();
};

module.exports = {
  createSuccessResponse,
  createErrorResponse,
  paginate,
  searchArray,
  handleDatabaseError,
  validateRequired,
  validateEmail,
  logRequest,
};
