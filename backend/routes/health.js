const express = require("express");
const router = express.Router();
const healthController = require("../controllers/healthController");

// GET /api/health - Basic health check
router.get("/", healthController.basicHealthCheck);

// GET /api/health/database - Detailed database status
router.get("/database", healthController.detailedDatabaseStatus);

// GET /api/health/stats - Database statistics
router.get("/stats", healthController.getDatabaseStats);

module.exports = router;
