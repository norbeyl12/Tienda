const database = require("../config/database");
const ProductCategory = require("../models/ProductCategory");
const queries = require("../utils/sqlQueries");
const {
  createSuccessResponse,
  createErrorResponse,
  handleDatabaseError,
} = require("../utils/responseHelpers");

class ProductCategoryController {
  // Get all categories
  async getAllCategories(req, res) {
    try {
      console.log("📂 Fetching all product categories from AdventureWorksLT2022...");

      // Test database connection first
      const connectionTest = await database.testConnection();
      
      if (!connectionTest.success && connectionTest.fallback) {
        console.log("⚠️ Using sample data due to database connection issues");
        const sampleCategories = [
          {
            ProductCategoryID: 1,
            ParentProductCategoryID: null,
            Name: "Bikes",
            rowguid: "sample-cat-guid-1",
            ModifiedDate: new Date()
          },
          {
            ProductCategoryID: 2,
            ParentProductCategoryID: null,
            Name: "Components",
            rowguid: "sample-cat-guid-2",
            ModifiedDate: new Date()
          },
          {
            ProductCategoryID: 3,
            ParentProductCategoryID: null,
            Name: "Clothing",
            rowguid: "sample-cat-guid-3",
            ModifiedDate: new Date()
          },
          {
            ProductCategoryID: 4,
            ParentProductCategoryID: null,
            Name: "Accessories",
            rowguid: "sample-cat-guid-4",
            ModifiedDate: new Date()
          }
        ];
        
        const categories = sampleCategories.map((category) =>
          new ProductCategory(category).toApiResponse()
        );
        
        return res.json(
          createSuccessResponse(
            categories,
            "Categories retrieved successfully (sample data)",
            categories.length
          )
        );
      }

      const rawCategories = await database.query(queries.categories.getAll);
      const categories = rawCategories.map((category) =>
        new ProductCategory(category).toApiResponse()
      );

      console.log(`✅ Retrieved ${categories.length} categories`);

      res.json(
        createSuccessResponse(
          categories,
          "Categories retrieved successfully",
          categories.length
        )
      );
    } catch (error) {
      console.error("❌ Error fetching categories:", error);
      
      // Fallback to sample data if database error
      console.log("⚠️ Using sample data due to database error");
      const sampleCategories = [
        {
          ProductCategoryID: 1,
          ParentProductCategoryID: null,
          Name: "Bikes",
          rowguid: "sample-cat-guid-1",
          ModifiedDate: new Date()
        },
        {
          ProductCategoryID: 2,
          ParentProductCategoryID: null,
          Name: "Components",
          rowguid: "sample-cat-guid-2",
          ModifiedDate: new Date()
        },
        {
          ProductCategoryID: 3,
          ParentProductCategoryID: null,
          Name: "Clothing",
          rowguid: "sample-cat-guid-3",
          ModifiedDate: new Date()
        },
        {
          ProductCategoryID: 4,
          ParentProductCategoryID: null,
          Name: "Accessories",
          rowguid: "sample-cat-guid-4",
          ModifiedDate: new Date()
        }
      ];
      
      const categories = sampleCategories.map((category) =>
        new ProductCategory(category).toApiResponse()
      );
      
      res.json(
        createSuccessResponse(
          categories,
          "Categories retrieved successfully (sample data - database connection issue)",
          categories.length
        )
      );
    }
  }

  // Get category by ID
  async getCategoryById(req, res) {
    try {
      const { id } = req.params;
      console.log(`📂 Fetching category with ID: ${id}`);

      if (!id || isNaN(id)) {
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
        const sampleCategories = [
          { ProductCategoryID: 1, Name: "Bikes" },
          { ProductCategoryID: 2, Name: "Components" },
          { ProductCategoryID: 3, Name: "Clothing" },
          { ProductCategoryID: 4, Name: "Accessories" }
        ];
        
        const foundCategory = sampleCategories.find(cat => cat.ProductCategoryID == id);
        
        if (!foundCategory) {
          return res
            .status(404)
            .json(
              createErrorResponse(
                "Category not found",
                `No category found with ID: ${id} (sample data)`,
                404
              )
            );
        }
        
        const category = new ProductCategory({
          ...foundCategory,
          ParentProductCategoryID: null,
          rowguid: `sample-cat-guid-${id}`,
          ModifiedDate: new Date()
        }).toApiResponse();
        
        return res.json(
          createSuccessResponse(category, "Category retrieved successfully (sample data)")
        );
      }

      const rawCategories = await database.query(queries.categories.getById, {
        categoryId: id,
      });

      if (rawCategories.length === 0) {
        return res
          .status(404)
          .json(
            createErrorResponse(
              "Category not found",
              `No category found with ID: ${id}`,
              404
            )
          );
      }

      const category = new ProductCategory(rawCategories[0]).toApiResponse();

      console.log(`✅ Retrieved category: ${category.name}`);

      res.json(
        createSuccessResponse(category, "Category retrieved successfully")
      );
    } catch (error) {
      console.error("❌ Error fetching category:", error);
      
      // Fallback to sample data if database error
      console.log("⚠️ Using sample data due to database error");
      const { id } = req.params;
      const sampleCategories = [
        { ProductCategoryID: 1, Name: "Bikes" },
        { ProductCategoryID: 2, Name: "Components" },
        { ProductCategoryID: 3, Name: "Clothing" },
        { ProductCategoryID: 4, Name: "Accessories" }
      ];
      
      const foundCategory = sampleCategories.find(cat => cat.ProductCategoryID == id);
      
      if (!foundCategory) {
        return res
          .status(404)
          .json(
            createErrorResponse(
              "Category not found",
              `No category found with ID: ${id} (sample data - database connection issue)`,
              404
            )
          );
      }
      
      const category = new ProductCategory({
        ...foundCategory,
        ParentProductCategoryID: null,
        rowguid: `sample-cat-guid-${id}`,
        ModifiedDate: new Date()
      }).toApiResponse();
      
      res.json(
        createSuccessResponse(category, "Category retrieved successfully (sample data - database connection issue)")
      );
    }
  }
}

module.exports = new ProductCategoryController();