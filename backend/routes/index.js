const express = require("express");
const router = express.Router();

// Import route modules
const productRoutes = require("./products");
const customerRoutes = require("./customers");
const categoryRoutes = require("./categories");
const healthRoutes = require("./health");

// Use routes
router.use("/products", productRoutes);
router.use("/customers", customerRoutes);
router.use("/categories", categoryRoutes);
router.use("/health", healthRoutes);

// Root API endpoint
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Adventure Works API - Connected to AdventureWorksLT2022",
    version: "2.0.0",
    database: "AdventureWorksLT2022",
    endpoints: {
      products: "/api/products",
      customers: "/api/customers",
      categories: "/api/categories",
      health: "/api/health",
    },
    documentation: {
      products: {
        "GET /api/products": "Get all products",
        "GET /api/products/:id": "Get product by ID",
        "GET /api/products/category/:categoryId": "Get products by category",
        "GET /api/products/search?q=term": "Search products",
      },
      customers: {
        "GET /api/customers": "Get all customers",
        "GET /api/customers/:id": "Get customer by ID",
        "GET /api/customers/email/:email": "Get customer by email",
        "GET /api/customers/search?q=term": "Search customers",
      },
      categories: {
        "GET /api/categories": "Get all categories",
        "GET /api/categories/:id": "Get category by ID",
      },
      health: {
        "GET /api/health": "Basic health check",
        "GET /api/health/database": "Detailed database status",
        "GET /api/health/stats": "Database statistics",
      },
    },
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
