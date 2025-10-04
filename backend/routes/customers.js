const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");

// GET /api/customers - Get all customers
router.get("/", customerController.getAllCustomers);

// GET /api/customers/search?q=searchTerm - Search customers
router.get("/search", customerController.searchCustomers);

// GET /api/customers/email/:email - Get customer by email
router.get("/email/:email", customerController.getCustomerByEmail);

// GET /api/customers/:id - Get customer by ID
router.get("/:id", customerController.getCustomerById);

module.exports = router;
