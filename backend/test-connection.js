const sql = require("mssql");
require("dotenv").config();

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

async function testConnection() {
  console.log("🔍 Testing MS SQL Server Connection...");
  console.log("📊 Configuration:");
  console.log(`   Server: ${config.server}:${config.port}`);
  console.log(`   Database: ${config.database}`);
  console.log(`   User: ${config.user || "Windows Authentication"}`);
  console.log(
    `   Password: ${
      config.password
        ? "*".repeat(config.password.length)
        : "Windows Authentication"
    }`
  );
  console.log(`   Integrated Security: ${config.options.integratedSecurity}`);
  console.log("");

  try {
    console.log("🔌 Attempting to connect...");
    const pool = await new sql.ConnectionPool(config).connect();
    console.log("✅ Successfully connected to MS SQL Server!");

    // Test basic query
    console.log("📝 Testing basic query...");
    const result = await pool
      .request()
      .query(
        "SELECT @@VERSION as version, DB_NAME() as current_database, GETDATE() as current_time"
      );

    if (result.recordset && result.recordset.length > 0) {
      const info = result.recordset[0];
      console.log("✅ Query executed successfully!");
      console.log(`   SQL Server Version: ${info.version.split("\n")[0]}`);
      console.log(`   Current Database: ${info.current_database}`);
      console.log(`   Server Time: ${info.current_time}`);
    }

    // Test table access
    console.log("📋 Testing table access...");
    const tableTest = await pool.request().query(`
      SELECT TOP 1 
        TABLE_SCHEMA,
        TABLE_NAME,
        TABLE_TYPE
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_TYPE = 'BASE TABLE'
      ORDER BY TABLE_NAME
    `);

    if (tableTest.recordset && tableTest.recordset.length > 0) {
      console.log("✅ Can access database tables!");
      console.log(
        `   Sample table: ${tableTest.recordset[0].TABLE_SCHEMA}.${tableTest.recordset[0].TABLE_NAME}`
      );
    }

    // Test AdventureWorks specific tables
    console.log("🏪 Testing AdventureWorks tables...");
    const advTest = await pool.request().query(`
      SELECT COUNT(*) as product_count FROM Product
    `);

    if (advTest.recordset && advTest.recordset.length > 0) {
      console.log("✅ AdventureWorks Product table accessible!");
      console.log(`   Total products: ${advTest.recordset[0].product_count}`);
    }

    await pool.close();
    console.log("🔌 Connection closed successfully.");
    console.log("");
    console.log(
      "🎉 All database tests passed! Your MS SQL Server connection is working perfectly."
    );
  } catch (error) {
    console.log("❌ Connection failed!");
    console.log(`   Error: ${error.message}`);
    console.log("");

    if (error.code) {
      console.log("🔧 Troubleshooting tips:");
      switch (error.code) {
        case "ECONNREFUSED":
          console.log("   • Check if SQL Server is running");
          console.log("   • Verify the server address and port");
          console.log("   • Check firewall settings");
          break;
        case "ELOGIN":
          console.log("   • Verify username and password");
          console.log("   • Check if the user has proper permissions");
          console.log("   • Ensure SQL Server authentication is enabled");
          break;
        case "EDBNOTEXIST":
          console.log("   • Check if the database exists");
          console.log("   • Verify database name spelling");
          break;
        default:
          console.log(`   • Error code: ${error.code}`);
          console.log("   • Check SQL Server configuration");
          console.log("   • Verify network connectivity");
      }
    }
  }
}

// Run the test
testConnection();
