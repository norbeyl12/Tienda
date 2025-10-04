const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Import utilities and middleware
const { logRequest } = require("./utils/responseHelpers");
const database = require("./config/database");

// Import routes
const apiRoutes = require("./routes");

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logRequest); // Request logging

// API Routes
app.use("/api", apiRoutes);

// Legacy compatibility routes (for existing frontend)
app.get("/api/db-status", async (req, res) => {
  try {
    const connectionResult = await database.testConnection();

    if (!connectionResult.success) {
      return res.status(503).json({
        success: false,
        error: connectionResult.error,
        message: "Database connection failed",
        timestamp: new Date().toISOString(),
      });
    }

    const detailsResult = await database.query(`
      SELECT 
        @@VERSION as server_version,
        DB_NAME() as database_name,
        GETDATE() as current_time,
        @@SERVERNAME as server_name
    `);

    const productCount = await database.query(
      "SELECT COUNT(*) as count FROM SalesLT.Product"
    );
    const customerCount = await database.query(
      "SELECT COUNT(*) as count FROM SalesLT.Customer"
    );
    const tableCount = await database.query(`
      SELECT COUNT(*) as table_count
      FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_SCHEMA = 'SalesLT'
    `);

    res.json({
      success: true,
      message: "Database connection is healthy",
      timestamp: new Date().toISOString(),
      database_info: {
        database_type: "mssql",
        server_version: detailsResult[0].server_version.split("\n")[0],
        database_name: detailsResult[0].database_name,
        server_name: detailsResult[0].server_name,
        server_time: detailsResult[0].current_time,
        total_tables: tableCount[0].table_count,
        products_count: productCount[0].count,
        customers_count: customerCount[0].count,
      },
    });
  } catch (error) {
    console.error("Database status check failed:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Database status check failed",
      timestamp: new Date().toISOString(),
    });
  }
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Adventure Works API Server",
    version: "2.0.0",
    database: "AdventureWorksLT2022",
    description:
      "API connected to native SQL Server AdventureWorksLT2022 database",
    endpoints: {
      api_root: "/api",
      products: "/api/products",
      customers: "/api/customers",
      health: "/api/health",
    },
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Unhandled error:", err);
  res.status(500).json({
    success: false,
    error: "Internal server error",
    message: err.message,
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
    message: `Route ${req.originalUrl} not found`,
    available_endpoints: {
      api_root: "/api",
      products: "/api/products",
      customers: "/api/customers",
      health: "/api/health",
    },
    timestamp: new Date().toISOString(),
  });
});

// Database connection test on startup
async function initializeServer() {
  try {
    console.log("🚀 Starting Adventure Works API Server...");
    console.log(
      `📊 Database: ${process.env.DB_DATABASE || "AdventureWorksLT2022"}`
    );
    console.log(`🔌 Server: ${process.env.DB_SERVER || "localhost"}`);

    // Test database connection
    const connectionTest = await database.testConnection();

    if (connectionTest.success) {
      console.log("✅ Database connection successful");
      console.log(`📋 Database: ${connectionTest.data.database_name}`);
      console.log(
        `🖥️  Server Version: ${connectionTest.data.version.split("\n")[0]}`
      );
    } else {
      console.error("❌ Database connection failed:", connectionTest.error);
      console.log(
        "⚠️  Server will continue but database features may not work"
      );
    }
  } catch (error) {
    console.error("❌ Server initialization error:", error.message);
    console.log("⚠️  Server will continue but database features may not work");
  }
}

// Start server
app.listen(PORT, async () => {
  await initializeServer();

  console.log("");
  console.log("🎉 Adventure Works API Server is running!");
  console.log(`🌐 Server: http://localhost:${PORT}`);
  console.log(`📋 API Documentation: http://localhost:${PORT}/api`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
  console.log(
    `📊 Database Status: http://localhost:${PORT}/api/health/database`
  );
  console.log(`📦 Products: http://localhost:${PORT}/api/products`);
  console.log(`👥 Customers: http://localhost:${PORT}/api/customers`);
  console.log("");
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\\n🛑 Shutting down server...");
  try {
    await database.close();
    console.log("✅ Database connection closed");
  } catch (error) {
    console.error("❌ Error closing database:", error.message);
  }
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\\n🛑 Received SIGTERM, shutting down gracefully...");
  try {
    await database.close();
    console.log("✅ Database connection closed");
  } catch (error) {
    console.error("❌ Error closing database:", error.message);
  }
  process.exit(0);
});

module.exports = app;
