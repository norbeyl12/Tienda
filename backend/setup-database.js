const sql = require("mssql");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const config = {
  server: process.env.DB_SERVER,
  port: parseInt(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
  },
};

async function setupDatabase() {
  try {
    console.log("🚀 Setting up AdventureWorks database...");

    // Connect to SQL Server (without specifying database)
    const pool = await new sql.ConnectionPool(config).connect();
    console.log("✅ Connected to SQL Server");

    // Read and execute the setup script
    const sqlScript = fs.readFileSync(
      path.join(__dirname, "../database/setup-adventureworks.sql"),
      "utf8"
    );

    // Split the script by GO statements and execute each batch
    const batches = sqlScript.split(/\nGO\s*\n/gi);

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i].trim();
      if (batch) {
        try {
          await pool.request().query(batch);
          console.log(`✅ Executed batch ${i + 1}/${batches.length}`);
        } catch (error) {
          console.error(`❌ Error in batch ${i + 1}:`, error.message);
        }
      }
    }

    await pool.close();
    console.log("🎉 AdventureWorks database setup completed!");
  } catch (error) {
    console.error("❌ Setup failed:", error.message);
    process.exit(1);
  }
}

// Run setup if called directly
if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase;
