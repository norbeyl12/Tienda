const express = require('express');
const categoryController = require('../controllers/categoryController');

const router = express.Router();

// Category routes
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);

module.exports = router;