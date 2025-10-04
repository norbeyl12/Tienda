const database = require("../config/database");
const Product = require("../models/Product");
const queries = require("../utils/sqlQueries");
const {
  createSuccessResponse,
  createErrorResponse,
  handleDatabaseError,
} = require("../utils/responseHelpers");

class ProductController {
  // Get all products
  async getAllProducts(req, res) {
    try {
      console.log("📦 Fetching all products from AdventureWorksLT2022...");

      // Test database connection first
      const connectionTest = await database.testConnection();

      if (!connectionTest.success && connectionTest.fallback) {
        console.log("⚠️ Using sample data due to database connection issues");
        const sampleData = database.getSampleData();
        return res.json(
          createSuccessResponse(
            sampleData.products,
            "Products retrieved successfully (sample data)",
            sampleData.products.length
          )
        );
      }

      const rawProducts = await database.query(queries.products.getAll);
      const products = rawProducts.map((product) =>
        new Product(product).toApiResponse()
      );

      console.log(`✅ Retrieved ${products.length} products`);

      res.json(
        createSuccessResponse(
          products,
          "Products retrieved successfully",
          products.length
        )
      );
    } catch (error) {
      console.error("❌ Error fetching products:", error);

      // Fallback to sample data if database error
      console.log("⚠️ Using sample data due to database error");
      const sampleData = database.getSampleData();
      res.json(
        createSuccessResponse(
          sampleData.products,
          "Products retrieved successfully (sample data - database connection issue)",
          sampleData.products.length
        )
      );
    }
  }

  // Get product by ID
  async getProductById(req, res) {
    try {
      const { id } = req.params;
      console.log(`📦 Fetching product with ID: ${id}`);

      if (!id || isNaN(id)) {
        return res
          .status(400)
          .json(
            createErrorResponse(
              "Invalid product ID",
              "Product ID must be a valid number",
              400
            )
          );
      }

      // Test database connection first
      const connectionTest = await database.testConnection();

      if (!connectionTest.success && connectionTest.fallback) {
        console.log("⚠️ Using sample data due to database connection issues");
        const sampleData = database.getSampleData();
        // Find product by ID in sample data
        const foundProduct = sampleData.products.find(
          (product) => product.ProductID == id
        );

        if (!foundProduct) {
          return res
            .status(404)
            .json(
              createErrorResponse(
                "Product not found",
                `No product found with ID: ${id} (sample data)`,
                404
              )
            );
        }

        const product = new Product(foundProduct).toApiResponse();

        return res.json(
          createSuccessResponse(
            product,
            "Product retrieved successfully (sample data)"
          )
        );
      }

      const rawProducts = await database.query(queries.products.getById, {
        productId: id,
      });

      if (rawProducts.length === 0) {
        return res
          .status(404)
          .json(
            createErrorResponse(
              "Product not found",
              `No product found with ID: ${id}`,
              404
            )
          );
      }

      const product = new Product(rawProducts[0]).toApiResponse();

      console.log(`✅ Retrieved product: ${product.name}`);

      res.json(
        createSuccessResponse(product, "Product retrieved successfully")
      );
    } catch (error) {
      console.error("❌ Error fetching product:", error);

      // Fallback to sample data if database error
      console.log("⚠️ Using sample data due to database error");
      const sampleData = database.getSampleData();
      const { id } = req.params;

      // Find product by ID in sample data
      const foundProduct = sampleData.products.find(
        (product) => product.ProductID == id
      );

      if (!foundProduct) {
        return res
          .status(404)
          .json(
            createErrorResponse(
              "Product not found",
              `No product found with ID: ${id} (sample data - database connection issue)`,
              404
            )
          );
      }

      const product = new Product(foundProduct).toApiResponse();

      res.json(
        createSuccessResponse(
          product,
          "Product retrieved successfully (sample data - database connection issue)"
        )
      );
    }
  }

  // Get products by category
  async getProductsByCategory(req, res) {
    try {
      const { categoryId } = req.params;
      console.log(`📦 Fetching products for category: ${categoryId}`);

      if (!categoryId || isNaN(categoryId)) {
        return res
          .status(400)
          .json(
            createErrorResponse(
              "Invalid category ID",
              "Category ID must be a valid number",
              400
            )
          );
      }

      // Test database connection first
      const connectionTest = await database.testConnection();

      if (!connectionTest.success && connectionTest.fallback) {
        console.log("⚠️ Using sample data due to database connection issues");
        const sampleData = database.getSampleData();
        // Filter sample products by category ID
        const filteredProducts = sampleData.products.filter(
          (product) => product.ProductCategoryID == categoryId
        );

        const products = filteredProducts.map((product) =>
          new Product(product).toApiResponse()
        );

        return res.json(
          createSuccessResponse(
            products,
            `Products retrieved successfully for category ${categoryId} (sample data)`,
            products.length
          )
        );
      }

      const rawProducts = await database.query(queries.products.getByCategory, {
        categoryId,
      });
      const products = rawProducts.map((product) =>
        new Product(product).toApiResponse()
      );

      console.log(
        `✅ Retrieved ${products.length} products for category ${categoryId}`
      );

      res.json(
        createSuccessResponse(
          products,
          `Products retrieved successfully for category ${categoryId}`,
          products.length
        )
      );
    } catch (error) {
      console.error("❌ Error fetching products by category:", error);

      // Fallback to sample data if database error
      console.log("⚠️ Using sample data due to database error");
      const sampleData = database.getSampleData();
      const { categoryId } = req.params;

      // Filter sample products by category ID
      const filteredProducts = sampleData.products.filter(
        (product) => product.ProductCategoryID == categoryId
      );

      const products = filteredProducts.map((product) =>
        new Product(product).toApiResponse()
      );

      res.json(
        createSuccessResponse(
          products,
          `Products retrieved successfully for category ${categoryId} (sample data - database connection issue)`,
          products.length
        )
      );
    }
  }

  // Search products
  async searchProducts(req, res) {
    try {
      const { q } = req.query;
      console.log(`🔍 Searching products with query: ${q}`);

      if (!q || q.trim().length < 2) {
        return res
          .status(400)
          .json(
            createErrorResponse(
              "Invalid search query",
              "Search query must be at least 2 characters long",
              400
            )
          );
      }

      // Test database connection first
      const connectionTest = await database.testConnection();

      if (!connectionTest.success && connectionTest.fallback) {
        console.log("⚠️ Using sample data due to database connection issues");
        const sampleData = database.getSampleData();
        const searchTerm = q.toLowerCase().trim();

        // Search in sample data
        const filteredProducts = sampleData.products.filter(
          (product) =>
            product.Name.toLowerCase().includes(searchTerm) ||
            product.ProductNumber.toLowerCase().includes(searchTerm) ||
            (product.CategoryName &&
              product.CategoryName.toLowerCase().includes(searchTerm)) ||
            (product.ProductDescription &&
              product.ProductDescription.toLowerCase().includes(searchTerm))
        );

        const products = filteredProducts.map((product) =>
          new Product(product).toApiResponse()
        );

        return res.json(
          createSuccessResponse(
            products,
            `Search completed for: ${q} (sample data)`,
            products.length
          )
        );
      }

      const searchQuery = `
        SELECT 
          p.ProductID,
          p.Name,
          p.ProductNumber,
          p.Color,
          p.StandardCost,
          p.ListPrice,
          p.Size,
          p.Weight,
          p.ProductCategoryID,
          p.ProductModelID,
          p.SellStartDate,
          p.SellEndDate,
          p.DiscontinuedDate,
          p.ThumbnailPhotoFileName,
          p.rowguid,
          p.ModifiedDate,
          pc.Name as CategoryName
        FROM SalesLT.Product p
        LEFT JOIN SalesLT.ProductCategory pc ON p.ProductCategoryID = pc.ProductCategoryID
        WHERE (p.Name LIKE @searchTerm 
           OR p.ProductNumber LIKE @searchTerm 
           OR pc.Name LIKE @searchTerm)
          AND (p.SellEndDate IS NULL OR p.SellEndDate > GETDATE())
        ORDER BY p.Name
      `;

      const searchTerm = `%${q}%`;
      const rawProducts = await database.query(searchQuery, { searchTerm });
      const products = rawProducts.map((product) =>
        new Product(product).toApiResponse()
      );

      console.log(`✅ Found ${products.length} products matching: ${q}`);

      res.json(
        createSuccessResponse(
          products,
          `Search completed for: ${q}`,
          products.length
        )
      );
    } catch (error) {
      console.error("❌ Error searching products:", error);

      // Fallback to sample data search if database error
      console.log("⚠️ Using sample data search due to database error");
      const sampleData = database.getSampleData();
      const { q } = req.query;
      const searchTerm = q.toLowerCase().trim();

      // Search in sample data
      const filteredProducts = sampleData.products.filter(
        (product) =>
          product.Name.toLowerCase().includes(searchTerm) ||
          product.ProductNumber.toLowerCase().includes(searchTerm) ||
          (product.CategoryName &&
            product.CategoryName.toLowerCase().includes(searchTerm)) ||
          (product.ProductDescription &&
            product.ProductDescription.toLowerCase().includes(searchTerm))
      );

      const products = filteredProducts.map((product) =>
        new Product(product).toApiResponse()
      );

      res.json(
        createSuccessResponse(
          products,
          `Search completed for: ${q} (sample data - database connection issue)`,
          products.length
        )
      );
    }
  }
}

module.exports = new ProductController();
