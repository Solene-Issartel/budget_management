let listController = require('../controllers/listController');
let login = require('../controllers/auth/login');

module.exports.listsRoutes = function (app){

  /**
   * PRODUCTS LIST (only for Admin)
   */
  app.get("/lists", login.verifyToken, listController.get);

   /**
   * PRODUCTS LIST (only for Admin)
   */
  app.get("/lists/create", login.verifyToken, listController.create_get);
  app.post("/lists/create", login.verifyToken, listController.create_post);

   /**
   * PRODUCT SUPPRESSION (only for Admin)
   */
  app.delete("/lists/delete/:id", login.verifyToken, (req, res) => {
    let id = req.params.id;
    listController.delete_post(id,req,res);
  });

  app.get("/lists/update/:id", login.verifyToken, (req, res) => {
    let id = req.params.id;
    listController.update_get(id,req,res);
  });
  app.put("/lists/update/:id", login.verifyToken, (req, res) => {
    let id = req.params.id;
    listController.update_post(id,req,res);
  });
}