let categorieController = require('../controllers/categorieController');
let login = require('../controllers/auth/login');

module.exports.categoriesRoutes = function (app){

  /**
   * categories LIST (only for Admin)
   */
  app.get("/categories", login.verifyToken, categorieController.get);

    /**
   * CREATE categorie (only for Admin)
   */
  app.get("/categories/create", login.verifyToken, categorieController.create_get);
  app.post("/categories/create", login.verifyToken, categorieController.create_post);

   /**
   * categorie SUPPRESSION (only for Admin)
   */
  app.delete("/categories/delete/:id", login.verifyToken, (req, res) => {
    let id = req.params.id;
    categorieController.delete_post(id,req,res);
  });

  app.get("/categories/update/:id", login.verifyToken, (req, res) => {
    let id = req.params.id;
    categorieController.update_get(id,req,res);
  });
  app.put("/categories/update/:id", login.verifyToken, (req, res) => {
    let id = req.params.id;
    categorieController.update_post(id,req,res);
  });
  
  return app;
}