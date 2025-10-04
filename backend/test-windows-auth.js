const sql = require("mssql");
const os = require("os");

async function testWindowsAuth() {
  // Get current user info
  const username = os.userInfo().username;
  const domain = os.userInfo().domain || process.env.USERDOMAIN || "";

  console.log(`🔍 Current user: ${domain}\\${username}`);

  const configs = [
    {
      name: "Config 1: NTLM with current user",
      config: {
        server: "localhost",
        database: "AdventureWorksLT2022",
        authentication: {
          type: "ntlm",
          options: {
            domain: domain,
            userName: username,
            password: "", // Empty for current user
          },
        },
        options: {
          encrypt: false,
          trustServerCertificate: true,
          enableArithAbort: true,
        },
      },
    },
    {
      name: "Config 2: NTLM with empty credentials (should use current user)",
      config: {
        server: "localhost",
        database: "AdventureWorksLT2022",
        authentication: {
          type: "ntlm",
          options: {
            domain: "",
            userName: "",
            password: "",
          },
        },
        options: {
          encrypt: false,
          trustServerCertificate: true,
          enableArithAbort: true,
        },
      },
    },
    {
      name: "Config 3: Default authentication",
      config: {
        server: "localhost",
        database: "AdventureWorksLT2022",
        authentication: {
          type: "default",
        },
        options: {
          encrypt: false,
          trustServerCertificate: true,
          enableArithAbort: true,
        },
      },
    },
  ];

  for (const testConfig of configs) {
    try {
      console.log(`\\n🔄 Testing: ${testConfig.name}`);

      const pool = await new sql.ConnectionPool(testConfig.config).connect();
      console.log("✅ SUCCESS! Connection established");

      const result = await pool.request().query(`
        SELECT 
          DB_NAME() as database_name,
          @@SERVERNAME as server_name,
          SYSTEM_USER as system_user,
          USER_NAME() as user_name,
          COUNT(*) as tables_count
        FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_SCHEMA = 'SalesLT'
      `);

      console.log(`📊 Database: ${result.recordset[0].database_name}`);
      console.log(`🖥️  Server: ${result.recordset[0].server_name}`);
      console.log(`👤 User: ${result.recordset[0].system_user}`);
      console.log(`📋 Tables in SalesLT: ${result.recordset[0].tables_count}`);

      // Test some actual data
      const productResult = await pool
        .request()
        .query("SELECT COUNT(*) as count FROM SalesLT.Product");
      console.log(`📦 Products: ${productResult.recordset[0].count}`);

      await pool.close();

      console.log("\\n🎉 WORKING CONFIGURATION FOUND!");
      console.log("✅ Use this configuration in your database.js:");
      console.log(JSON.stringify(testConfig.config, null, 2));
      return testConfig.config;
    } catch (error) {
      console.log(`❌ Failed: ${error.message}`);
    }
  }

  console.log("\\n❌ No working configuration found");
  return null;
}

testWindowsAuth().catch(console.error);
