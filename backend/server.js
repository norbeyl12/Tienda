const express = require("express");
const cors = require("cors");
const database = require("./database");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes

// Get all products
app.get("/api/products", async (req, res) => {
  try {
    await database.connect();
    const products = await database.query(`
      SELECT 
        p.ProductID as id,
        p.Name as name,
        pc.Name as category,
        p.ListPrice as price,
        'USD' as currency,
        p.SafetyStockLevel as stock,
        'AdventureWorks' as brand,
        COALESCE(p.Color, 'Sin especificar') as color,
        p.ProductNumber as description,
        'https://picsum.photos/200/200?random=' || p.ProductID as image_url
      FROM Product p
      LEFT JOIN ProductCategory pc ON p.CategoryID = pc.ProductCategoryID
      WHERE p.SellEndDate IS NULL
      ORDER BY p.Name
    `);

    res.json({
      success: true,
      data: products,
      total: products.length,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      error: "Error al obtener productos",
    });
  }
});

// Get product by ID
app.get("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const products = await database.query(
      `
      SELECT 
        p.ProductID as id,
        p.Name as name,
        pc.Name as category,
        p.ListPrice as price,
        'USD' as currency,
        p.SafetyStockLevel as stock,
        'AdventureWorks' as brand,
        COALESCE(p.Color, 'Sin especificar') as color,
        p.ProductNumber as description,
        'https://picsum.photos/200/200?random=' || p.ProductID as image_url
      FROM Product p
      LEFT JOIN ProductCategory pc ON p.CategoryID = pc.ProductCategoryID
      WHERE p.ProductID = ?
    `,
      [id]
    );

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Producto no encontrado",
      });
    }

    res.json({
      success: true,
      data: products[0],
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({
      success: false,
      error: "Error al obtener producto",
    });
  }
});

// Get all customers
app.get("/api/customers", async (req, res) => {
  try {
    await database.connect();
    const customers = await database.query(`
      SELECT 
        c.CustomerID as id,
        (p.FirstName || 
               CASE WHEN p.MiddleName IS NOT NULL THEN ' ' || p.MiddleName ELSE '' END ||
               ' ' || p.LastName) as name,
        (p.FirstName || ' ' || p.LastName) as "user",
        e.EmailAddress as email,
        c.AccountNumber as phone,
        'Cliente AdventureWorks' as companyName,
        'Sistema' as seller,
        date(c.ModifiedDate) as modificationDate
      FROM Customer c
      LEFT JOIN Person p ON c.PersonID = p.BusinessEntityID
      LEFT JOIN EmailAddress e ON p.BusinessEntityID = e.BusinessEntityID
      ORDER BY p.FirstName, p.LastName
    `);

    res.json({
      success: true,
      data: customers,
      total: customers.length,
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({
      success: false,
      error: "Error al obtener clientes",
    });
  }
});

// Get customer by ID
app.get("/api/customers/:id", async (req, res) => {
  try {
    await database.connect();
    const { id } = req.params;
    const customers = await database.query(
      `
      SELECT 
        c.CustomerID as id,
        (p.FirstName || 
               CASE WHEN p.MiddleName IS NOT NULL THEN ' ' || p.MiddleName ELSE '' END ||
               ' ' || p.LastName) as name,
        (p.FirstName || ' ' || p.LastName) as "user",
        e.EmailAddress as email,
        c.AccountNumber as phone,
        'Cliente AdventureWorks' as companyName,
        'Sistema' as seller,
        date(c.ModifiedDate) as modificationDate
      FROM Customer c
      LEFT JOIN Person p ON c.PersonID = p.BusinessEntityID
      LEFT JOIN EmailAddress e ON p.BusinessEntityID = e.BusinessEntityID
      WHERE c.CustomerID = ?
    `,
      [id]
    );

    if (customers.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Cliente no encontrado",
      });
    }

    res.json({
      success: true,
      data: customers[0],
    });
  } catch (error) {
    console.error("Error fetching customer:", error);
    res.status(500).json({
      success: false,
      error: "Error al obtener cliente",
    });
  }
});

// Get product categories
app.get("/api/categories", async (req, res) => {
  try {
    await database.connect();
    const categories = await database.query(`
      SELECT 
        ProductCategoryID as id,
        Name as name
      FROM ProductCategory
      ORDER BY Name
    `);

    res.json({
      success: true,
      data: categories,
      total: categories.length,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      success: false,
      error: "Error al obtener categorías",
    });
  }
});

// Health check endpoint
app.get("/api/health", async (req, res) => {
  try {
    await database.connect();
    await database.query("SELECT 1 as test");
    res.json({
      success: true,
      message: "API and database are working correctly",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Health check failed:", error.message);
    res.status(500).json({
      success: false,
      error: "Database connection failed",
      details: error.message,
    });
  }
});

// Detailed database status endpoint
app.get("/api/db-status", async (req, res) => {
  try {
    await database.connect();

    // Test basic connection
    const basicTest = await database.query(
      "SELECT datetime('now') as server_time"
    );

    // Test table access
    const tableCount = await database.query(`
      SELECT COUNT(*) as table_count 
      FROM sqlite_master 
      WHERE type = 'table' AND name NOT LIKE 'sqlite_%'
    `);

    // Test AdventureWorks specific data
    const productCount = await database.query(
      "SELECT COUNT(*) as count FROM Product"
    );
    const customerCount = await database.query(
      "SELECT COUNT(*) as count FROM Customer"
    );

    res.json({
      success: true,
      message: "Database connection is healthy",
      timestamp: new Date().toISOString(),
      database_info: {
        database_type: process.env.DATABASE_TYPE || "sqlite",
        server_time: basicTest[0].server_time,
        total_tables: tableCount[0].table_count,
        products_count: productCount[0].count,
        customers_count: customerCount[0].count,
      },
    });
  } catch (error) {
    console.error("Database status check failed:", error);
    res.status(500).json({
      success: false,
      error: "Database connection failed",
      error_details: error.message,
      timestamp: new Date().toISOString(),
      database_type: process.env.DATABASE_TYPE || "sqlite",
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    error: "Internal server error",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Tienda API server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔍 Database status: http://localhost:${PORT}/api/db-status`);
  console.log(`📦 Products: http://localhost:${PORT}/api/products`);
  console.log(`👥 Customers: http://localhost:${PORT}/api/customers`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down server...");
  await database.close();
  process.exit(0);
});
