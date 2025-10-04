const sql = require("mssql");

async function testDifferentAuthMethods() {
  const configs = [
    {
      name: "Config 1: integratedSecurity without authentication object",
      config: {
        server: "localhost",
        database: "AdventureWorksLT2022",
        options: {
          encrypt: false,
          trustServerCertificate: true,
          enableArithAbort: true,
          integratedSecurity: true,
        },
      },
    },
    {
      name: "Config 2: authentication type default",
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
    {
      name: "Config 3: authentication type ntlm without credentials",
      config: {
        server: "localhost",
        database: "AdventureWorksLT2022",
        authentication: {
          type: "ntlm",
        },
        options: {
          encrypt: false,
          trustServerCertificate: true,
          enableArithAbort: true,
        },
      },
    },
    {
      name: "Config 4: No authentication object, no integratedSecurity",
      config: {
        server: "localhost",
        database: "AdventureWorksLT2022",
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
      console.log("Config:", JSON.stringify(testConfig.config, null, 2));

      const pool = await new sql.ConnectionPool(testConfig.config).connect();
      console.log("✅ SUCCESS! Connection established");

      const result = await pool
        .request()
        .query("SELECT DB_NAME() as db, @@SERVERNAME as server");
      console.log(
        `📊 Connected to: ${result.recordset[0].db} on ${result.recordset[0].server}`
      );

      await pool.close();

      // If we get here, this config worked - save it and return
      console.log("\\n🎉 WORKING CONFIGURATION FOUND!");
      return testConfig.config;
    } catch (error) {
      console.log(`❌ Failed: ${error.message}`);
    }
  }

  console.log("\\n❌ No working configuration found");
  return null;
}

testDifferentAuthMethods()
  .then((workingConfig) => {
    if (workingConfig) {
      console.log("\\n✅ Use this configuration:");
      console.log(JSON.stringify(workingConfig, null, 2));
    }
  })
  .catch(console.error);
