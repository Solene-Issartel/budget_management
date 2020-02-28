let productController = require('../controllers/productController');
let login = require('../controllers/auth/login');

module.exports.productsRoutes = function (app){

  /**
   * PRODUCTS LIST (only for Admin)
   */
  app.get("/products", login.verifyToken, productController.get);

   /**
   * PRODUCT SUPPRESSION (only for Admin)
   */
  app.delete("/products/delete/:id", login.verifyToken, (req, res) => {
    let id = req.params.id;
    productController.delete_post(id,req,res);
  });

  app.get("/products/update/:id", login.verifyToken, (req, res) => {
    let id = req.params.id;
    productController.update_get(id,req,res);
  });
  app.put("/products/update/:id", login.verifyToken, (req, res) => {
    let id = req.params.id;
    productController.update_post(id,req,res);
  });



  
  return app;
}