const database = require("../config/database");
const Customer = require("../models/Customer");
const queries = require("../utils/sqlQueries");
const {
  createSuccessResponse,
  createErrorResponse,
  handleDatabaseError,
} = require("../utils/responseHelpers");

class CustomerController {
  // Get all customers
  async getAllCustomers(req, res) {
    try {
      console.log("👥 Fetching all customers from AdventureWorksLT2022...");

      // Test database connection first
      const connectionTest = await database.testConnection();
      
      if (!connectionTest.success && connectionTest.fallback) {
        console.log("⚠️ Using sample data due to database connection issues");
        const sampleData = database.getSampleData();
        const customers = sampleData.customers.map((customer) =>
          new Customer(customer).toApiResponse()
        );
        
        return res.json(
          createSuccessResponse(
            customers,
            "Customers retrieved successfully (sample data)",
            customers.length
          )
        );
      }

      const rawCustomers = await database.query(queries.customers.getAll);
      const customers = rawCustomers.map((customer) =>
        new Customer(customer).toApiResponse()
      );

      console.log(`✅ Retrieved ${customers.length} customers`);

      res.json(
        createSuccessResponse(
          customers,
          "Customers retrieved successfully",
          customers.length
        )
      );
    } catch (error) {
      console.error("❌ Error fetching customers:", error);
      
      // Fallback to sample data if database error
      console.log("⚠️ Using sample data due to database error");
      const sampleData = database.getSampleData();
      const customers = sampleData.customers.map((customer) =>
        new Customer(customer).toApiResponse()
      );
      
      res.json(
        createSuccessResponse(
          customers,
          "Customers retrieved successfully (sample data - database connection issue)",
          customers.length
        )
      );
    }
  }

  // Get customer by ID
  async getCustomerById(req, res) {
    try {
      const { id } = req.params;
      console.log(`👤 Fetching customer with ID: ${id}`);

      if (!id || isNaN(id)) {
        return res
          .status(400)
          .json(
            createErrorResponse(
              "Invalid customer ID",
              "Customer ID must be a valid number",
              400
            )
          );
      }

      // Test database connection first
      const connectionTest = await database.testConnection();
      
      if (!connectionTest.success && connectionTest.fallback) {
        console.log("⚠️ Using sample data due to database connection issues");
        const sampleData = database.getSampleData();
        // Find customer by ID in sample data
        const foundCustomer = sampleData.customers.find(
          customer => customer.CustomerID == id
        );
        
        if (!foundCustomer) {
          return res
            .status(404)
            .json(
              createErrorResponse(
                "Customer not found",
                `No customer found with ID: ${id} (sample data)`,
                404
              )
            );
        }
        
        const customer = new Customer(foundCustomer).toApiResponse();
        
        return res.json(
          createSuccessResponse(customer, "Customer retrieved successfully (sample data)")
        );
      }

      const rawCustomers = await database.query(queries.customers.getById, {
        customerId: id,
      });

      if (rawCustomers.length === 0) {
        return res
          .status(404)
          .json(
            createErrorResponse(
              "Customer not found",
              `No customer found with ID: ${id}`,
              404
            )
          );
      }

      const customer = new Customer(rawCustomers[0]).toApiResponse();

      console.log(`✅ Retrieved customer: ${customer.name}`);

      res.json(
        createSuccessResponse(customer, "Customer retrieved successfully")
      );
    } catch (error) {
      console.error("❌ Error fetching customer:", error);
      
      // Fallback to sample data if database error
      console.log("⚠️ Using sample data due to database error");
      const sampleData = database.getSampleData();
      const { id } = req.params;
      
      // Find customer by ID in sample data
      const foundCustomer = sampleData.customers.find(
        customer => customer.CustomerID == id
      );
      
      if (!foundCustomer) {
        return res
          .status(404)
          .json(
            createErrorResponse(
              "Customer not found",
              `No customer found with ID: ${id} (sample data - database connection issue)`,
              404
            )
          );
      }
      
      const customer = new Customer(foundCustomer).toApiResponse();
      
      res.json(
        createSuccessResponse(customer, "Customer retrieved successfully (sample data - database connection issue)")
      );
    }
  }

  // Get customer by email
  async getCustomerByEmail(req, res) {
    try {
      const { email } = req.params;
      console.log(`📧 Fetching customer with email: ${email}`);

      if (!email || !email.includes("@")) {
        return res
          .status(400)
          .json(
            createErrorResponse(
              "Invalid email",
              "Please provide a valid email address",
              400
            )
          );
      }

      // Test database connection first
      const connectionTest = await database.testConnection();
      
      if (!connectionTest.success && connectionTest.fallback) {
        console.log("⚠️ Using sample data due to database connection issues");
        const sampleData = database.getSampleData();
        // Find customer by email in sample data
        const foundCustomer = sampleData.customers.find(
          customer => customer.EmailAddress && customer.EmailAddress.toLowerCase() === email.toLowerCase()
        );
        
        if (!foundCustomer) {
          return res
            .status(404)
            .json(
              createErrorResponse(
                "Customer not found",
                `No customer found with email: ${email} (sample data)`,
                404
              )
            );
        }
        
        const customer = new Customer(foundCustomer).toApiResponse();
        
        return res.json(
          createSuccessResponse(customer, "Customer retrieved successfully (sample data)")
        );
      }

      const rawCustomers = await database.query(queries.customers.getByEmail, {
        email,
      });

      if (rawCustomers.length === 0) {
        return res
          .status(404)
          .json(
            createErrorResponse(
              "Customer not found",
              `No customer found with email: ${email}`,
              404
            )
          );
      }

      const customer = new Customer(rawCustomers[0]).toApiResponse();

      console.log(`✅ Retrieved customer: ${customer.name}`);

      res.json(
        createSuccessResponse(customer, "Customer retrieved successfully")
      );
    } catch (error) {
      console.error("❌ Error fetching customer by email:", error);
      
      // Fallback to sample data if database error
      console.log("⚠️ Using sample data due to database error");
      const sampleData = database.getSampleData();
      const { email } = req.params;
      
      // Find customer by email in sample data
      const foundCustomer = sampleData.customers.find(
        customer => customer.EmailAddress && customer.EmailAddress.toLowerCase() === email.toLowerCase()
      );
      
      if (!foundCustomer) {
        return res
          .status(404)
          .json(
            createErrorResponse(
              "Customer not found",
              `No customer found with email: ${email} (sample data - database connection issue)`,
              404
            )
          );
      }
      
      const customer = new Customer(foundCustomer).toApiResponse();
      
      res.json(
        createSuccessResponse(customer, "Customer retrieved successfully (sample data - database connection issue)")
      );
    }
  }

  // Search customers
  async searchCustomers(req, res) {
    try {
      const { q } = req.query;
      console.log(`🔍 Searching customers with query: ${q}`);

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
        const filteredCustomers = sampleData.customers.filter(customer => 
          (customer.FirstName && customer.FirstName.toLowerCase().includes(searchTerm)) ||
          (customer.LastName && customer.LastName.toLowerCase().includes(searchTerm)) ||
          (customer.CompanyName && customer.CompanyName.toLowerCase().includes(searchTerm)) ||
          (customer.EmailAddress && customer.EmailAddress.toLowerCase().includes(searchTerm))
        );
        
        const customers = filteredCustomers.map((customer) =>
          new Customer(customer).toApiResponse()
        );
        
        return res.json(
          createSuccessResponse(
            customers,
            `Search completed for: ${q} (sample data)`,
            customers.length
          )
        );
      }

      const searchQuery = `
        SELECT 
          CustomerID,
          NameStyle,
          Title,
          FirstName,
          MiddleName,
          LastName,
          Suffix,
          CompanyName,
          SalesPerson,
          EmailAddress,
          Phone,
          PasswordHash,
          PasswordSalt,
          rowguid,
          ModifiedDate
        FROM SalesLT.Customer
        WHERE FirstName LIKE @searchTerm 
           OR LastName LIKE @searchTerm 
           OR CompanyName LIKE @searchTerm
           OR EmailAddress LIKE @searchTerm
        ORDER BY FirstName, LastName
      `;

      const searchTerm = `%${q}%`;
      const rawCustomers = await database.query(searchQuery, { searchTerm });
      const customers = rawCustomers.map((customer) =>
        new Customer(customer).toApiResponse()
      );

      console.log(`✅ Found ${customers.length} customers matching: ${q}`);

      res.json(
        createSuccessResponse(
          customers,
          `Search completed for: ${q}`,
          customers.length
        )
      );
    } catch (error) {
      console.error("❌ Error searching customers:", error);
      
      // Fallback to sample data search if database error
      console.log("⚠️ Using sample data search due to database error");
      const sampleData = database.getSampleData();
      const { q } = req.query;
      const searchTerm = q.toLowerCase().trim();
      
      // Search in sample data
      const filteredCustomers = sampleData.customers.filter(customer => 
        (customer.FirstName && customer.FirstName.toLowerCase().includes(searchTerm)) ||
        (customer.LastName && customer.LastName.toLowerCase().includes(searchTerm)) ||
        (customer.CompanyName && customer.CompanyName.toLowerCase().includes(searchTerm)) ||
        (customer.EmailAddress && customer.EmailAddress.toLowerCase().includes(searchTerm))
      );
      
      const customers = filteredCustomers.map((customer) =>
        new Customer(customer).toApiResponse()
      );
      
      res.json(
        createSuccessResponse(
          customers,
          `Search completed for: ${q} (sample data - database connection issue)`,
          customers.length
        )
      );
    }
  }
}

module.exports = new CustomerController();
