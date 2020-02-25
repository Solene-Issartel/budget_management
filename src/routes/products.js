let productController = require('../controllers/productController');
let login = require('../controllers/auth/login');

module.exports.productsRoutes = function (app){

  /**
   * USERS LIST (only for Admin)
   */
  app.get("/products", login.verifyToken, productController.get);

  
  return app;
}