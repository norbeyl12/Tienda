const sql = require("mssql");

async function testSpecificConfig() {
  const config = {
    server: "localhost",
    database: "AdventureWorksLT2022",
    options: {
      encrypt: false,
      trustServerCertificate: true,
      enableArithAbort: true,
      integratedSecurity: true,
    },
  };

  try {
    console.log("🔌 Testing localhost connection with integrated security...");
    console.log("Config:", JSON.stringify(config, null, 2));

    const pool = await new sql.ConnectionPool(config).connect();
    console.log("✅ Connection successful!");

    const result = await pool.request().query(`
      SELECT 
        @@VERSION as version,
        DB_NAME() as database_name,
        @@SERVERNAME as server_name,
        GETDATE() as current_time
    `);

    console.log("📊 Database info:");
    console.log("Server:", result.recordset[0].server_name);
    console.log("Database:", result.recordset[0].database_name);
    console.log("Version:", result.recordset[0].version.split("\\n")[0]);
    console.log("Time:", result.recordset[0].current_time);

    // Test AdventureWorks data
    const productResult = await pool
      .request()
      .query("SELECT COUNT(*) as count FROM SalesLT.Product");
    console.log("Products count:", productResult.recordset[0].count);

    await pool.close();
    return true;
  } catch (error) {
    console.error("❌ Connection failed:", error.message);
    console.error("Error code:", error.code);
    console.error("Error number:", error.number);
    console.error("Full error:", error);
    return false;
  }
}

testSpecificConfig();
