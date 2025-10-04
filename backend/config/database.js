const sql = require("mssql");
require("dotenv").config();

// Multiple configurations to try
const configurations = [
  // Try SQL Server authentication first
  {
    name: "SQL Server Authentication",
    config: {
      server: "localhost",
      database: "AdventureWorksLT2022",
      user: "api_user",
      password: "ApiPassword123!",
      options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true,
        connectionTimeout: 10000,
        requestTimeout: 10000,
      },
    },
  },
  // Fallback to Windows Authentication with explicit settings
  {
    name: "Windows Authentication (localhost)",
    config: {
      server: "localhost",
      database: "AdventureWorksLT2022",
      options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true,
        integratedSecurity: true,
        connectionTimeout: 10000,
        requestTimeout: 10000,
      },
    },
  },
  // Try with computer name
  {
    name: "Windows Authentication (computer name)",
    config: {
      server: "Norbey",
      database: "AdventureWorksLT2022",
      options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true,
        integratedSecurity: true,
        connectionTimeout: 10000,
        requestTimeout: 10000,
      },
    },
  },
];

let workingConfig = configurations[0].config; // Default to first config

// Add port only if specified
if (process.env.DB_PORT) {
  config.port = parseInt(process.env.DB_PORT);
}

class Database {
  constructor() {
    this.pool = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      if (!this.pool || !this.isConnected) {
        console.log("🔌 Connecting to AdventureWorksLT2022...");

        // Try each configuration until one works
        let lastError = null;
        for (const { name, config } of configurations) {
          try {
            console.log(`🔄 Trying: ${name}`);
            this.pool = await new sql.ConnectionPool(config).connect();
            this.isConnected = true;
            workingConfig = config; // Save the working configuration
            console.log(`✅ Connected successfully using: ${name}`);
            return this.pool;
          } catch (error) {
            console.log(`❌ ${name} failed: ${error.message}`);
            lastError = error;
            continue;
          }
        }

        // If all configurations failed
        throw lastError || new Error("All database configurations failed");
      }
      return this.pool;
    } catch (error) {
      console.error("❌ Database connection error:", error.message);
      this.isConnected = false;
      throw error;
    }
  }

  async query(queryText, params = {}) {
    try {
      const pool = await this.connect();
      const request = pool.request();

      // Add parameters to request
      for (const [key, value] of Object.entries(params)) {
        request.input(key, value);
      }

      console.log("📝 Executing query:", queryText.substring(0, 100) + "...");
      const result = await request.query(queryText);
      return result.recordset;
    } catch (error) {
      console.error("❌ Query error:", error.message);
      throw error;
    }
  }

  async testConnection() {
    try {
      await this.connect();
      const result = await this.query(
        "SELECT @@VERSION as version, DB_NAME() as database_name, GETDATE() as current_time"
      );
      return {
        success: true,
        data: result[0],
        message: "Database connection successful",
      };
    } catch (error) {
      console.warn(
        "⚠️ Database connection failed, but continuing with limited functionality:",
        error.message
      );
      return {
        success: false,
        error: error.message,
        message: "Database connection failed - using fallback mode",
        fallback: true,
      };
    }
  }

  async close() {
    try {
      if (this.pool && this.isConnected) {
        await this.pool.close();
        this.pool = null;
        this.isConnected = false;
        console.log("🔌 Database connection closed");
      }
    } catch (error) {
      console.error("❌ Error closing database:", error.message);
    }
  }

  // Health check method with fallback
  async healthCheck() {
    try {
      const result = await this.query("SELECT 1 as health_check");
      return result.length > 0;
    } catch (error) {
      console.warn("⚠️ Database health check failed:", error.message);
      return false;
    }
  }

  // Get sample data when database is not available
  getSampleData() {
    return {
      products: [
        {
          ProductID: 1,
          Name: "Adventure Works Bike - Model 1",
          ProductNumber: "AW-BIKE-001",
          Color: "Red",
          StandardCost: 100.0,
          ListPrice: 150.0,
          Size: "M",
          Weight: 1.5,
          ProductCategoryID: 1,
          ProductModelID: 1,
          SellStartDate: new Date(),
          SellEndDate: null,
          DiscontinuedDate: null,
          ThumbnailPhoto: null,
          ThumbnailPhotoFileName: "bike1.jpg",
          rowguid: "sample-guid-1",
          ModifiedDate: new Date(),
          CategoryName: "Bikes",
          ProductModelName: "Adventure Bike Model 1",
          CatalogDescription:
            "High-quality adventure bike for outdoor enthusiasts",
          ProductDescription: "Perfect for mountain trails and city rides",
        },
        {
          ProductID: 2,
          Name: "Adventure Works Component - Brake Set",
          ProductNumber: "AW-COMP-002",
          Color: "Black",
          StandardCost: 50.0,
          ListPrice: 75.0,
          Size: "Standard",
          Weight: 0.8,
          ProductCategoryID: 2,
          ProductModelID: 2,
          SellStartDate: new Date(),
          SellEndDate: null,
          DiscontinuedDate: null,
          ThumbnailPhoto: null,
          ThumbnailPhotoFileName: "brake1.jpg",
          rowguid: "sample-guid-2",
          ModifiedDate: new Date(),
          CategoryName: "Components",
          ProductModelName: "Brake Component Model",
          CatalogDescription: "Professional-grade brake system",
          ProductDescription: "Reliable braking system for all bike types",
        },
        {
          ProductID: 3,
          Name: "Adventure Works Jersey - Blue",
          ProductNumber: "AW-CLOTH-003",
          Color: "Blue",
          StandardCost: 25.0,
          ListPrice: 45.0,
          Size: "L",
          Weight: 0.3,
          ProductCategoryID: 3,
          ProductModelID: 3,
          SellStartDate: new Date(),
          SellEndDate: null,
          DiscontinuedDate: null,
          ThumbnailPhoto: null,
          ThumbnailPhotoFileName: "jersey1.jpg",
          rowguid: "sample-guid-3",
          ModifiedDate: new Date(),
          CategoryName: "Clothing",
          ProductModelName: "Sport Jersey",
          CatalogDescription: "Comfortable cycling jersey",
          ProductDescription: "Breathable fabric perfect for long rides",
        },
      ],
      customers: [
        {
          CustomerID: 1,
          NameStyle: false,
          Title: "Mr.",
          FirstName: "John",
          MiddleName: "A",
          LastName: "Doe",
          Suffix: null,
          CompanyName: "Adventure Sports Inc.",
          SalesPerson: "adventure-works\\sales1",
          EmailAddress: "john.doe@adventuresports.com",
          Phone: "555-0123",
          PasswordHash: "sample-hash",
          PasswordSalt: "sample-salt",
          rowguid: "sample-customer-guid-1",
          ModifiedDate: new Date(),
          TotalOrders: 5,
          TotalSpent: 1250.0,
        },
        {
          CustomerID: 2,
          NameStyle: false,
          Title: "Ms.",
          FirstName: "Jane",
          MiddleName: null,
          LastName: "Smith",
          Suffix: null,
          CompanyName: null,
          SalesPerson: "adventure-works\\sales2",
          EmailAddress: "jane.smith@email.com",
          Phone: "555-0456",
          PasswordHash: "sample-hash-2",
          PasswordSalt: "sample-salt-2",
          rowguid: "sample-customer-guid-2",
          ModifiedDate: new Date(),
          TotalOrders: 3,
          TotalSpent: 680.0,
        },
      ],
    };
  }
}

module.exports = new Database();
