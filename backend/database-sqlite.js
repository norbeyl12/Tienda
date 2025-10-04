const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "adventureworks.db");

class Database {
  constructor() {
    this.db = null;
  }

  async connect() {
    try {
      if (!this.db) {
        this.db = new sqlite3.Database(dbPath);
        console.log("✅ Connected to SQLite AdventureWorks database");
        await this.setupTables();
      }
      return this.db;
    } catch (error) {
      console.error("❌ Database connection error:", error.message);
      throw error;
    }
  }

  async setupTables() {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        // Create ProductCategory table
        this.db.run(`
          CREATE TABLE IF NOT EXISTS ProductCategory (
            ProductCategoryID INTEGER PRIMARY KEY AUTOINCREMENT,
            Name TEXT NOT NULL,
            ModifiedDate DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Create Product table
        this.db.run(`
          CREATE TABLE IF NOT EXISTS Product (
            ProductID INTEGER PRIMARY KEY AUTOINCREMENT,
            Name TEXT NOT NULL,
            ProductNumber TEXT NOT NULL,
            Color TEXT,
            ListPrice REAL NOT NULL DEFAULT 0,
            SafetyStockLevel INTEGER NOT NULL DEFAULT 0,
            CategoryID INTEGER,
            SellStartDate DATETIME DEFAULT CURRENT_TIMESTAMP,
            SellEndDate DATETIME,
            ModifiedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (CategoryID) REFERENCES ProductCategory(ProductCategoryID)
          )
        `);

        // Create Person table
        this.db.run(`
          CREATE TABLE IF NOT EXISTS Person (
            BusinessEntityID INTEGER PRIMARY KEY AUTOINCREMENT,
            FirstName TEXT NOT NULL,
            MiddleName TEXT,
            LastName TEXT NOT NULL,
            ModifiedDate DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Create EmailAddress table
        this.db.run(`
          CREATE TABLE IF NOT EXISTS EmailAddress (
            BusinessEntityID INTEGER PRIMARY KEY,
            EmailAddress TEXT NOT NULL,
            ModifiedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (BusinessEntityID) REFERENCES Person(BusinessEntityID)
          )
        `);

        // Create Customer table
        this.db.run(
          `
          CREATE TABLE IF NOT EXISTS Customer (
            CustomerID INTEGER PRIMARY KEY AUTOINCREMENT,
            PersonID INTEGER,
            AccountNumber TEXT,
            ModifiedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (PersonID) REFERENCES Person(BusinessEntityID)
          )
        `,
          (err) => {
            if (err) {
              reject(err);
            } else {
              this.insertSampleData(resolve, reject);
            }
          }
        );
      });
    });
  }

  insertSampleData(resolve, reject) {
    // Check if data already exists
    this.db.get("SELECT COUNT(*) as count FROM ProductCategory", (err, row) => {
      if (err) {
        reject(err);
        return;
      }

      if (row.count > 0) {
        console.log("📄 Sample data already exists");
        resolve();
        return;
      }

      console.log("📝 Inserting sample data...");

      this.db.serialize(() => {
        // Insert categories
        const categoryStmt = this.db.prepare(
          "INSERT INTO ProductCategory (Name) VALUES (?)"
        );
        categoryStmt.run("Bikes");
        categoryStmt.run("Components");
        categoryStmt.run("Clothing");
        categoryStmt.run("Accessories");
        categoryStmt.finalize();

        // Insert products
        const productStmt = this.db.prepare(`
          INSERT INTO Product (Name, ProductNumber, Color, ListPrice, SafetyStockLevel, CategoryID) 
          VALUES (?, ?, ?, ?, ?, ?)
        `);
        productStmt.run("Mountain Bike", "BK-M68B-38", "Black", 1200.0, 100, 1);
        productStmt.run("Road Bike", "BK-R93R-44", "Red", 1500.0, 75, 1);
        productStmt.run("Helmet", "HL-U509-R", "Red", 25.0, 50, 4);
        productStmt.run("Water Bottle", "WB-H098", "Blue", 5.0, 200, 4);
        productStmt.run("Bike Chain", "CH-0234", "Silver", 15.0, 150, 2);
        productStmt.finalize();

        // Insert persons
        const personStmt = this.db.prepare(
          "INSERT INTO Person (FirstName, LastName) VALUES (?, ?)"
        );
        personStmt.run("John", "Doe");
        personStmt.run("Jane", "Smith");
        personStmt.run("Carlos", "García");
        personStmt.run("María", "López");
        personStmt.run("Pedro", "Martínez");
        personStmt.finalize();

        // Insert email addresses
        const emailStmt = this.db.prepare(
          "INSERT INTO EmailAddress (BusinessEntityID, EmailAddress) VALUES (?, ?)"
        );
        emailStmt.run(1, "john.doe@email.com");
        emailStmt.run(2, "jane.smith@email.com");
        emailStmt.run(3, "carlos.garcia@email.com");
        emailStmt.run(4, "maria.lopez@email.com");
        emailStmt.run(5, "pedro.martinez@email.com");
        emailStmt.finalize();

        // Insert customers
        const customerStmt = this.db.prepare(
          "INSERT INTO Customer (PersonID, AccountNumber) VALUES (?, ?)"
        );
        customerStmt.run(1, "AW00000001");
        customerStmt.run(2, "AW00000002");
        customerStmt.run(3, "AW00000003");
        customerStmt.run(4, "AW00000004");
        customerStmt.run(5, "AW00000005", (err) => {
          customerStmt.finalize();
          if (err) {
            reject(err);
          } else {
            console.log("✅ Sample data inserted successfully!");
            resolve();
          }
        });
      });
    });
  }

  async query(queryText) {
    return new Promise((resolve, reject) => {
      const db = this.db;
      if (!db) {
        reject(new Error("Database not connected"));
        return;
      }

      db.all(queryText, (err, rows) => {
        if (err) {
          console.error("❌ Query error:", err.message);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  async close() {
    try {
      if (this.db) {
        this.db.close();
        this.db = null;
        console.log("🔌 Database connection closed");
      }
    } catch (error) {
      console.error("❌ Error closing database:", error.message);
    }
  }
}

module.exports = new Database();
