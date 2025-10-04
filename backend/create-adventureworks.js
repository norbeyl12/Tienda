const sql = require("mssql");
require("dotenv").config();

const config = {
  server: process.env.DB_SERVER || "(localdb)\\MSSQLLocalDB",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
  user: process.env.DB_USER || undefined,
  password: process.env.DB_PASSWORD || undefined,
  database: "master", // Connect to master first
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
    integratedSecurity: !process.env.DB_USER,
  },
};

async function createAdventureWorksDB() {
  let pool;
  try {
    console.log("🚀 Creating AdventureWorks database...");
    console.log(`📊 Server: ${config.server}:${config.port}`);
    console.log(
      `🔐 Auth: ${
        config.options.integratedSecurity
          ? "Windows Authentication"
          : "SQL Server Authentication"
      }`
    );
    console.log("");

    // Connect to master database
    pool = await new sql.ConnectionPool(config).connect();
    console.log("✅ Connected to SQL Server");

    // Check if AdventureWorks database exists
    const checkDB = await pool.request().query(`
      SELECT database_id 
      FROM sys.databases 
      WHERE name = 'AdventureWorks'
    `);

    if (checkDB.recordset.length > 0) {
      console.log("📄 AdventureWorks database already exists!");
    } else {
      console.log("🔨 Creating AdventureWorks database...");
      await pool.request().query(`
        CREATE DATABASE AdventureWorks
      `);
      console.log("✅ AdventureWorks database created!");
    }

    // Switch to AdventureWorks database
    await pool.close();
    config.database = "AdventureWorks";
    pool = await new sql.ConnectionPool(config).connect();
    console.log("✅ Connected to AdventureWorks database");

    // Create tables
    console.log("📋 Creating tables...");

    // Create ProductCategory table
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='ProductCategory' AND xtype='U')
      CREATE TABLE ProductCategory (
        ProductCategoryID int IDENTITY(1,1) PRIMARY KEY,
        Name nvarchar(50) NOT NULL,
        ModifiedDate datetime2 DEFAULT GETDATE()
      )
    `);

    // Create Product table
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Product' AND xtype='U')
      CREATE TABLE Product (
        ProductID int IDENTITY(1,1) PRIMARY KEY,
        Name nvarchar(50) NOT NULL,
        ProductNumber nvarchar(25) NOT NULL,
        Color nvarchar(15) NULL,
        ListPrice money NOT NULL DEFAULT 0,
        SafetyStockLevel smallint NOT NULL DEFAULT 0,
        CategoryID int NULL,
        SellStartDate datetime2 NOT NULL DEFAULT GETDATE(),
        SellEndDate datetime2 NULL,
        ModifiedDate datetime2 DEFAULT GETDATE(),
        FOREIGN KEY (CategoryID) REFERENCES ProductCategory(ProductCategoryID)
      )
    `);

    // Create Person table
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Person' AND xtype='U')
      CREATE TABLE Person (
        BusinessEntityID int IDENTITY(1,1) PRIMARY KEY,
        FirstName nvarchar(50) NOT NULL,
        MiddleName nvarchar(50) NULL,
        LastName nvarchar(50) NOT NULL,
        ModifiedDate datetime2 DEFAULT GETDATE()
      )
    `);

    // Create EmailAddress table
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='EmailAddress' AND xtype='U')
      CREATE TABLE EmailAddress (
        BusinessEntityID int NOT NULL,
        EmailAddress nvarchar(50) NOT NULL,
        ModifiedDate datetime2 DEFAULT GETDATE(),
        PRIMARY KEY (BusinessEntityID),
        FOREIGN KEY (BusinessEntityID) REFERENCES Person(BusinessEntityID)
      )
    `);

    // Create Customer table
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Customer' AND xtype='U')
      CREATE TABLE Customer (
        CustomerID int IDENTITY(1,1) PRIMARY KEY,
        PersonID int NULL,
        AccountNumber nvarchar(10) NULL,
        ModifiedDate datetime2 DEFAULT GETDATE(),
        FOREIGN KEY (PersonID) REFERENCES Person(BusinessEntityID)
      )
    `);

    console.log("✅ Tables created successfully!");

    // Insert sample data
    console.log("📝 Inserting sample data...");

    // Insert categories
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM ProductCategory WHERE Name = 'Bikes')
      INSERT INTO ProductCategory (Name) VALUES 
      ('Bikes'), ('Components'), ('Clothing'), ('Accessories')
    `);

    // Insert sample products
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM Product WHERE ProductNumber = 'BK-M68B-38')
      INSERT INTO Product (Name, ProductNumber, Color, ListPrice, SafetyStockLevel, CategoryID) VALUES 
      ('Mountain Bike', 'BK-M68B-38', 'Black', 1200.00, 100, 1),
      ('Road Bike', 'BK-R93R-44', 'Red', 1500.00, 75, 1),
      ('Helmet', 'HL-U509-R', 'Red', 25.00, 50, 4),
      ('Water Bottle', 'WB-H098', 'Blue', 5.00, 200, 4),
      ('Bike Chain', 'CH-0234', 'Silver', 15.00, 150, 2)
    `);

    // Insert sample persons
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM Person WHERE FirstName = 'John')
      INSERT INTO Person (FirstName, LastName) VALUES 
      ('John', 'Doe'),
      ('Jane', 'Smith'),
      ('Carlos', 'García'),
      ('María', 'López'),
      ('Pedro', 'Martínez')
    `);

    // Insert email addresses
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM EmailAddress WHERE EmailAddress = 'john.doe@email.com')
      INSERT INTO EmailAddress (BusinessEntityID, EmailAddress) VALUES 
      (1, 'john.doe@email.com'),
      (2, 'jane.smith@email.com'),
      (3, 'carlos.garcia@email.com'),
      (4, 'maria.lopez@email.com'),
      (5, 'pedro.martinez@email.com')
    `);

    // Insert customers
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM Customer WHERE PersonID = 1)
      INSERT INTO Customer (PersonID, AccountNumber) VALUES 
      (1, 'AW00000001'),
      (2, 'AW00000002'),
      (3, 'AW00000003'),
      (4, 'AW00000004'),
      (5, 'AW00000005')
    `);

    console.log("✅ Sample data inserted successfully!");

    // Verify data
    const productCount = await pool
      .request()
      .query("SELECT COUNT(*) as count FROM Product");
    const customerCount = await pool
      .request()
      .query("SELECT COUNT(*) as count FROM Customer");
    const categoryCount = await pool
      .request()
      .query("SELECT COUNT(*) as count FROM ProductCategory");

    console.log("");
    console.log("📊 Database Summary:");
    console.log(`   Categories: ${categoryCount.recordset[0].count}`);
    console.log(`   Products: ${productCount.recordset[0].count}`);
    console.log(`   Customers: ${customerCount.recordset[0].count}`);
    console.log("");
    console.log("🎉 AdventureWorks database setup completed successfully!");
  } catch (error) {
    console.error("❌ Setup failed:", error.message);

    if (error.code === "ELOGIN") {
      console.log("");
      console.log("🔧 Authentication troubleshooting:");
      console.log("   • Make sure SQL Server is running");
      console.log("   • Check if Windows Authentication is enabled");
      console.log("   • Try running as administrator");
      console.log("   • Verify SQL Server service is started");
    }

    process.exit(1);
  } finally {
    if (pool) {
      await pool.close();
    }
  }
}

// Run setup if called directly
if (require.main === module) {
  createAdventureWorksDB();
}

module.exports = createAdventureWorksDB;
