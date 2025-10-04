const database = require("../config/database");
const queries = require("../utils/sqlQueries");
const {
  createSuccessResponse,
  createErrorResponse,
  handleDatabaseError,
} = require("../utils/responseHelpers");

class HealthController {
  // Basic health check
  async basicHealthCheck(req, res) {
    try {
      console.log("🔍 Performing health check...");

      // Test database connection
      const connectionResult = await database.testConnection();

      if (connectionResult.success) {
        const isHealthy = await database.healthCheck();
        if (isHealthy) {
          res.json(
            createSuccessResponse(
              {
                status: "healthy",
                database: "connected",
                message: "API and database are working correctly",
              },
              "Health check passed"
            )
          );
        } else {
          res
            .status(503)
            .json(
              createErrorResponse(
                "Database health check failed",
                "Database query test failed",
                503
              )
            );
        }
      } else if (connectionResult.fallback) {
        // Database connection failed but we have fallback
        res.json(
          createSuccessResponse(
            {
              status: "degraded",
              database: "disconnected",
              fallback: "active",
              message:
                "API is working with sample data - database connection failed",
              error: connectionResult.error,
            },
            "Health check passed with fallback mode"
          )
        );
      } else {
        res
          .status(503)
          .json(
            createErrorResponse(
              "Database health check failed",
              connectionResult.error || "Database is not responding",
              503
            )
          );
      }
    } catch (error) {
      console.error("❌ Health check failed:", error);
      res
        .status(503)
        .json(createErrorResponse("Health check failed", error.message, 503));
    }
  }

  // Detailed database status
  async detailedDatabaseStatus(req, res) {
    try {
      console.log("🔍 Performing detailed database status check...");

      // Test basic connection
      const connectionResult = await database.testConnection();

      if (!connectionResult.success) {
        return res
          .status(503)
          .json(
            createErrorResponse(
              connectionResult.error,
              "Database connection failed",
              503
            )
          );
      }

      // Get detailed information
      const detailsResult = await database.query(queries.health.detailed);
      const tableCountResult = await database.query(queries.health.tableCount);

      // Get table counts
      const productCount = await database.query(
        "SELECT COUNT(*) as count FROM SalesLT.Product"
      );
      const customerCount = await database.query(
        "SELECT COUNT(*) as count FROM SalesLT.Customer"
      );
      const categoryCount = await database.query(
        "SELECT COUNT(*) as count FROM SalesLT.ProductCategory"
      );

      const statusInfo = {
        database_info: {
          server_version: detailsResult[0].server_version.split("\n")[0],
          database_name: detailsResult[0].database_name,
          server_name: detailsResult[0].server_name,
          current_time: detailsResult[0].current_time,
          total_tables: tableCountResult[0].table_count,
          products_count: productCount[0].count,
          customers_count: customerCount[0].count,
          categories_count: categoryCount[0].count,
        },
        connection_config: {
          server: process.env.DB_SERVER || "localhost",
          database: process.env.DB_DATABASE || "AdventureWorksLT2022",
          port: process.env.DB_PORT || 1433,
          integrated_security: process.env.DB_INTEGRATED_SECURITY === "true",
        },
      };

      console.log("✅ Database status check completed successfully");

      res.json(
        createSuccessResponse(
          statusInfo,
          "Database status retrieved successfully"
        )
      );
    } catch (error) {
      console.error("❌ Detailed status check failed:", error);
      const errorResponse = handleDatabaseError(error, "detailed status check");
      res.status(errorResponse.statusCode).json(errorResponse);
    }
  }

  // Get database statistics
  async getDatabaseStats(req, res) {
    try {
      console.log("📊 Fetching database statistics...");

      const stats = {
        products: {
          total: 0,
          active: 0,
          discontinued: 0,
          categories: 0,
        },
        customers: {
          total: 0,
          with_orders: 0,
        },
        orders: {
          total: 0,
          this_year: 0,
        },
      };

      // Get product statistics
      const productStats = await database.query(`
        SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN SellEndDate IS NULL OR SellEndDate > GETDATE() THEN 1 END) as active,
          COUNT(CASE WHEN SellEndDate IS NOT NULL AND SellEndDate <= GETDATE() THEN 1 END) as discontinued
        FROM SalesLT.Product
      `);

      const categoryCount = await database.query(
        "SELECT COUNT(*) as count FROM SalesLT.ProductCategory"
      );

      stats.products = {
        total: productStats[0].total,
        active: productStats[0].active,
        discontinued: productStats[0].discontinued,
        categories: categoryCount[0].count,
      };

      // Get customer statistics
      const customerStats = await database.query(`
        SELECT 
          COUNT(DISTINCT c.CustomerID) as total,
          COUNT(DISTINCT soh.CustomerID) as with_orders
        FROM SalesLT.Customer c
        LEFT JOIN SalesLT.SalesOrderHeader soh ON c.CustomerID = soh.CustomerID
      `);

      stats.customers = customerStats[0];

      // Get order statistics
      const orderStats = await database.query(`
        SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN YEAR(OrderDate) = YEAR(GETDATE()) THEN 1 END) as this_year
        FROM SalesLT.SalesOrderHeader
      `);

      stats.orders = orderStats[0];

      console.log("✅ Database statistics retrieved successfully");

      res.json(
        createSuccessResponse(
          stats,
          "Database statistics retrieved successfully"
        )
      );
    } catch (error) {
      console.error("❌ Error fetching database statistics:", error);
      const errorResponse = handleDatabaseError(
        error,
        "fetch database statistics"
      );
      res.status(errorResponse.statusCode).json(errorResponse);
    }
  }
}

module.exports = new HealthController();
