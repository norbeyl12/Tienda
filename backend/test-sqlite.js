const database = require("./database");

async function testDatabase() {
  try {
    console.log("🔍 Testing SQLite database...");

    // Connect to database
    await database.connect();
    console.log("✅ Database connected successfully");

    // Test basic query
    const result = await database.query(
      "SELECT COUNT(*) as count FROM Product"
    );
    console.log(`📦 Products in database: ${result[0].count}`);

    // Test customers
    const customers = await database.query(
      "SELECT COUNT(*) as count FROM Customer"
    );
    console.log(`👥 Customers in database: ${customers[0].count}`);

    console.log("🎉 Database test completed successfully!");
  } catch (error) {
    console.error("❌ Database test failed:", error.message);
    console.error("Full error:", error);
  } finally {
    await database.close();
  }
}

testDatabase();
