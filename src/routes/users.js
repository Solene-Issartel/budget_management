let userController = require('../controllers/userController');
let login = require('../controllers/auth/login');
let express = require('express');

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
  app.get("/user/update", login.verifyToken, userController.update_get);
  app.post("/user/update", login.verifyToken, userController.update_post);

  /**
   * DELETE USER (only admin)
   */
  app.post("/users/delete/:id", userController.delete_user);

  /**
   * DELETE MY ACCOUNT
   */
  app.post("/user/delete/:id", login.verifyToken, (req, res) => {
      var id = req.params.id;
      userController.delete_account(id,req,res);
  });

  return app;
}