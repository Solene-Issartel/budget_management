let listController = require('../controllers/listController');
let login = require('../controllers/auth/login');
const express = require('express');
let router = express.Router();

  /**
   * PRODUCTS LIST (only for Admin)
   */
  router.get("/", login.verifyToken, listController.get);

   /**
   * PRODUCTS LIST (only for Admin)
   */
  router.get("/create", login.verifyToken, listController.create_get);
  router.post("/create", login.verifyToken, listController.create_post);

   /**
   * PRODUCT SUPPRESSION (only for Admin)
   */
  router.delete("/delete/:id", login.verifyToken, (req, res) => {
    let id = req.params.id;
    listController.delete_post(id,req,res);
  });

  router.get("/update/:id", login.verifyToken, (req, res) => {
    let id = req.params.id;
    listController.update_get(id,req,res);
  });
  router.put("/update/:id", login.verifyToken, (req, res) => {
    let id = req.params.id;
    listController.update_post(id,req,res);
  });
  
  module.exports = router;