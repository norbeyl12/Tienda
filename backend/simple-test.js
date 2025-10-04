const sql = require("mssql");

async function simpleTest() {
  console.log("🔍 Testing simple Windows authentication...");

  const config = {
    server: "localhost",
    database: "AdventureWorksLT2022",
    authentication: {
      type: "ntlm",
      options: {
        domain: "NORBEY",
        userName: "norbey",
        password: "",
      },
    },
    options: {
      encrypt: false,
      trustServerCertificate: true,
      enableArithAbort: true,
      connectionTimeout: 5000,
      requestTimeout: 5000,
    },
  };

  try {
    console.log("Config:", JSON.stringify(config, null, 2));
    console.log("🔌 Attempting connection...");

    const pool = await new sql.ConnectionPool(config).connect();
    console.log("✅ Connected successfully!");

    const result = await pool.request().query("SELECT DB_NAME() as db");
    console.log("Database:", result.recordset[0].db);

    await pool.close();
    console.log("🎉 Test completed successfully!");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

simpleTest();
