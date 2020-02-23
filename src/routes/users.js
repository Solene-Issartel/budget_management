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
  //app.get('/users/:id', userController.get);
  
  /**
   * MODIFY USER (his account/or admin)
   */
  app.get("/users/update", login.verifyToken, userController.update_get);
  app.post("/users/update", login.verifyToken, userController.update_post);

 
  /**
   * DELETE USER (only admin)
   */
  app.post("/users/delete/:id", userController.delete_user);

  /**
   * DELETE OUR ACCOUNT (all users)
   */
  app.post("/user/delete/:id", (req, res) => {
      var id = req.params.id;
      console.log(id);
      userController.delete_account(id,req,res);
  });

  return app;
}