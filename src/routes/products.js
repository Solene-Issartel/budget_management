let productController = require('../controllers/productController');
let login = require('../controllers/auth/login');
const express = require('express');
let router = express.Router();

  /**
   * PRODUCTS LIST (only for Admin)
   */
  router.get("/", login.verifyToken, productController.get);

    /**
   * CREATE PRODUCT (only for Admin)
   */
  router.get("/create", login.verifyToken, productController.create_get);
  router.post("/create", login.verifyToken, productController.create_post);

   /**
   * PRODUCT SUPPRESSION (only for Admin)
   */
  router.delete("/delete/:id", login.verifyToken, (req, res) => {
    let id = req.params.id;
    productController.delete_post(id,req,res);
  });

  router.get("/update/:id", login.verifyToken, (req, res) => {
    let id = req.params.id;
    productController.update_get(id,req,res);
  });
  router.put("/update/:id", login.verifyToken, (req, res) => {
    let id = req.params.id;
    productController.update_post(id,req,res);
  });

  router.get('/all',productController.get_all)
  router.post('/all',productController.get_all)

module.exports = router;