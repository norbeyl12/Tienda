require("dotenv").config();

const databaseType = process.env.DATABASE_TYPE || "sqlite";

if (databaseType === "sqlite") {
  module.exports = require("./database-sqlite");
} else {
  // Original MSSQL implementation
  const sql = require("mssql");

  const config = {
    server: process.env.DB_SERVER || "(localdb)\\MSSQLLocalDB",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
    user: process.env.DB_USER || undefined,
    password: process.env.DB_PASSWORD || undefined,
    database: process.env.DB_DATABASE || "master",
    options: {
      encrypt: false,
      trustServerCertificate: true,
      enableArithAbort: true,
      integratedSecurity: !process.env.DB_USER,
    },
  };

  class Database {
    constructor() {
      this.pool = null;
    }

    async connect() {
      try {
        if (!this.pool) {
          this.pool = await new sql.ConnectionPool(config).connect();
          console.log("✅ Connected to AdventureWorks database");
        }
        return this.pool;
      } catch (error) {
        console.error("❌ Database connection error:", error.message);
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

        const result = await request.query(queryText);
        return result.recordset;
      } catch (error) {
        console.error("❌ Query error:", error.message);
        throw error;
      }
    }

    async close() {
      try {
        if (this.pool) {
          await this.pool.close();
          this.pool = null;
          console.log("🔌 Database connection closed");
        }
      } catch (error) {
        console.error("❌ Error closing database:", error.message);
      }
    }
  }

  module.exports = new Database();
}
