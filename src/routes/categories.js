let categorieController = require('../controllers/categorieController');
let login = require('../controllers/auth/login');
const express = require('express');
let router = express.Router();

// module.exports.categoriesRoutes = function (router){

  /**
   * categories LIST (only for Admin)
   */
  router.get("/", login.verifyToken, categorieController.get);

    /**
   * CREATE categorie (only for Admin)
   */
  router.get("/create", login.verifyToken, categorieController.create_get);
  router.post("/create", login.verifyToken, categorieController.create_post);

   /**
   * categorie SUPPRESSION (only for Admin)
   */
  router.delete("/delete/:id", login.verifyToken, (req, res) => {
    let id = req.params.id;
    categorieController.delete_post(id,req,res);
  });

  router.get("/update/:id", login.verifyToken, (req, res) => {
    let id = req.params.id;
    categorieController.update_get(id,req,res);
  });
  router.put("/update/:id", login.verifyToken, (req, res) => {
    let id = req.params.id;
    categorieController.update_post(id,req,res);
  });
  
  module.exports = router;
//   return router;
// }