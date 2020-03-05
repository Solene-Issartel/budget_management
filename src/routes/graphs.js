let listController = require('../controllers/listController');
let login = require('../controllers/auth/login');
const express = require('express');
let router = express.Router();

router.get('/',login.verifyToken,listController.graphs_get);
router.post('/budgets',login.verifyToken,listController.get_budgets);

module.exports = router;