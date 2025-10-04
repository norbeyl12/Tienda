const database = require("../config/database");

async function testAdventureWorksConnection() {
  console.log("🔍 Testing AdventureWorksLT2022 Database Connection...");
  console.log("=".repeat(60));

  try {
    // Test basic connection
    console.log("📡 Testing database connection...");
    const connectionResult = await database.testConnection();

    if (!connectionResult.success) {
      console.error("❌ Connection failed:", connectionResult.error);
      return;
    }

    console.log("✅ Database connection successful!");
    console.log(`📋 Database: ${connectionResult.data.database_name}`);
    console.log(
      `🖥️  Server Version: ${connectionResult.data.version.split("\\n")[0]}`
    );
    console.log(`🕐 Server Time: ${connectionResult.data.current_time}`);
    console.log("");

    // Test data availability
    console.log("📊 Testing data availability...");

    const productCount = await database.query(
      "SELECT COUNT(*) as count FROM SalesLT.Product"
    );
    console.log(`📦 Products available: ${productCount[0].count}`);

    const customerCount = await database.query(
      "SELECT COUNT(*) as count FROM SalesLT.Customer"
    );
    console.log(`👥 Customers available: ${customerCount[0].count}`);

    const categoryCount = await database.query(
      "SELECT COUNT(*) as count FROM SalesLT.ProductCategory"
    );
    console.log(`🏷️  Categories available: ${categoryCount[0].count}`);

    const orderCount = await database.query(
      "SELECT COUNT(*) as count FROM SalesLT.SalesOrderHeader"
    );
    console.log(`🛒 Orders available: ${orderCount[0].count}`);

    console.log("");

    // Test sample queries
    console.log("🔍 Testing sample queries...");

    const sampleProducts = await database.query(`
      SELECT TOP 3 ProductID, Name, ListPrice 
      FROM SalesLT.Product 
      WHERE ListPrice > 0 
      ORDER BY ListPrice DESC
    `);

    console.log("💰 Top 3 most expensive products:");
    sampleProducts.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.Name} - $${product.ListPrice}`);
    });

    console.log("");

    const sampleCustomers = await database.query(`
      SELECT TOP 3 CustomerID, FirstName, LastName, CompanyName 
      FROM SalesLT.Customer 
      ORDER BY CustomerID
    `);

    console.log("👤 Sample customers:");
    sampleCustomers.forEach((customer, index) => {
      const name =
        customer.CompanyName || `${customer.FirstName} ${customer.LastName}`;
      console.log(`   ${index + 1}. ID: ${customer.CustomerID} - ${name}`);
    });

    console.log("");
    console.log("🎉 All tests passed! AdventureWorksLT2022 is ready to use.");
    console.log("=".repeat(60));
  } catch (error) {
    console.error("❌ Connection test failed:", error.message);
    console.log("");
    console.log("🔧 Troubleshooting tips:");
    console.log("   • Make sure SQL Server is running");
    console.log("   • Verify AdventureWorksLT2022 database exists");
    console.log("   • Check Windows Authentication permissions");
    console.log("   • Ensure SQL Server accepts local connections");
    console.log("   • Try running as administrator");
  } finally {
    await database.close();
  }
}

// Run test if called directly
if (require.main === module) {
  testAdventureWorksConnection();
}

module.exports = testAdventureWorksConnection;
