let userController = require('../controllers/userController');
let login = require('../controllers/auth/login');

module.exports.usersRoutes = function (app){

  /**
   * USERS LIST (only for Admin)
   */
  app.get("/users", login.verifyToken, userController.get);

  /**
   * SPECIFIC USER (with his id in parameter)
   */
  app.get('/users/:id', login.verifyToken, (req, res) => {
    var id = req.params.id;
    userController.user_info_get(id,req,res);
});

  app.post('/users/:id', login.verifyToken, (req, res) => {
    var id = req.params.id;
    userController.user_info_post(id,req,res);
});
  
  /**
   * MODIFY USER (his account)
   */
  app.get("/profile/update", login.verifyToken, userController.update_get);
  app.put("/profile/update", login.verifyToken, userController.update_post);

  /**
   * DELETE USER (only admin)
   */
  app.delete("/users/delete/:id", login.verifyToken,(req, res) => {
    let id = req.params.id;
    let from = false; //var to know if the delete form is from the user and not an admin 
    userController.delete_account(id,from,req,res);
  });

  /**
   * DELETE MY ACCOUNT
   */
  app.delete("/profile/delete/:id", login.verifyToken, (req, res) => {
      let id = req.params.id;
      let from = true; //var to know if the delete form is from the user and not an admin 
      userController.delete_account(id,from,req,res);
  });

  return app;
}