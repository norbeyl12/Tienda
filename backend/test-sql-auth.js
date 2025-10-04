const sql = require("mssql");

async function testSqlAuth() {
  console.log("🔍 Testing SQL Server authentication...");

  const config = {
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
  };

  try {
    console.log("🔌 Attempting SQL Server authentication...");

    const pool = await new sql.ConnectionPool(config).connect();
    console.log("✅ Connected successfully with SQL Server authentication!");

    const result = await pool.request().query(`
      SELECT 
        DB_NAME() as database_name,
        @@SERVERNAME as server_name,
        SYSTEM_USER as system_user,
        USER_NAME() as user_name
    `);

    console.log("📊 Connection details:");
    console.log(`   Database: ${result.recordset[0].database_name}`);
    console.log(`   Server: ${result.recordset[0].server_name}`);
    console.log(`   System User: ${result.recordset[0].system_user}`);
    console.log(`   Database User: ${result.recordset[0].user_name}`);

    // Test AdventureWorks data access
    console.log("\\n🧪 Testing data access...");
    const productResult = await pool
      .request()
      .query("SELECT COUNT(*) as count FROM SalesLT.Product");
    console.log(`   Products count: ${productResult.recordset[0].count}`);

    const customerResult = await pool
      .request()
      .query("SELECT COUNT(*) as count FROM SalesLT.Customer");
    console.log(`   Customers count: ${customerResult.recordset[0].count}`);

    await pool.close();

    console.log("\\n🎉 SQL Server authentication is working!");
    console.log("✅ You can use this configuration:");
    console.log(JSON.stringify(config, null, 2));

    return config;
  } catch (error) {
    console.error("❌ SQL Server authentication failed:", error.message);
    console.error(
      "ℹ️  This might be because SQL Server needs to be restarted for mixed mode authentication to take effect."
    );
    return null;
  }
}

testSqlAuth();
