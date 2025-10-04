const sql = require("mssql");

// Test configurations to try
const testConfigs = [
  {
    name: "Default instance with integrated security",
    config: {
      server: "localhost",
      database: "AdventureWorksLT2022",
      options: {
        encrypt: false,
        trustServerCertificate: true,
        integratedSecurity: true,
      },
    },
  },
  {
    name: "MSSQLSERVER01 instance with integrated security",
    config: {
      server: "localhost\\MSSQLSERVER01",
      database: "AdventureWorksLT2022",
      options: {
        encrypt: false,
        trustServerCertificate: true,
        integratedSecurity: true,
      },
    },
  },
  {
    name: "Default instance with SA user",
    config: {
      server: "localhost",
      database: "AdventureWorksLT2022",
      user: "sa",
      password: "", // Will need actual password
      options: {
        encrypt: false,
        trustServerCertificate: true,
      },
    },
  },
  {
    name: "Using (local) as server",
    config: {
      server: "(local)",
      database: "AdventureWorksLT2022",
      options: {
        encrypt: false,
        trustServerCertificate: true,
        integratedSecurity: true,
      },
    },
  },
  {
    name: "Using . as server (current instance)",
    config: {
      server: ".",
      database: "AdventureWorksLT2022",
      options: {
        encrypt: false,
        trustServerCertificate: true,
        integratedSecurity: true,
      },
    },
  },
];

async function testConnection(config, name) {
  try {
    console.log(`\n🔄 Testing: ${name}`);
    console.log(`   Server: ${config.server}`);

    const pool = await new sql.ConnectionPool(config).connect();
    const result = await pool
      .request()
      .query("SELECT @@VERSION as version, DB_NAME() as database_name");

    console.log(
      `✅ SUCCESS! Connected to: ${result.recordset[0].database_name}`
    );
    console.log(`   Version: ${result.recordset[0].version.split("\\n")[0]}`);

    await pool.close();
    return { success: true, config, name };
  } catch (error) {
    console.log(`❌ FAILED: ${error.message}`);
    return { success: false, error: error.message, config, name };
  }
}

async function runTests() {
  console.log("🚀 Testing SQL Server connections...\n");

  const results = [];

  for (const test of testConfigs) {
    const result = await testConnection(test.config, test.name);
    results.push(result);

    if (result.success) {
      console.log(`\n🎉 WORKING CONFIGURATION FOUND!`);
      console.log(`Configuration: ${result.name}`);
      console.log(`Config object:`, JSON.stringify(result.config, null, 2));
      break; // Stop on first success
    }
  }

  console.log(`\n📊 Test Summary:`);
  console.log(`Total tests: ${results.length}`);
  console.log(`Successful: ${results.filter((r) => r.success).length}`);
  console.log(`Failed: ${results.filter((r) => !r.success).length}`);

  if (!results.some((r) => r.success)) {
    console.log(`\n❌ No working configuration found. Please check:`);
    console.log(`   1. SQL Server is running`);
    console.log(`   2. AdventureWorksLT2022 database exists`);
    console.log(`   3. User has proper permissions`);
    console.log(`   4. SQL Server allows connections`);
  }
}

runTests().catch(console.error);
