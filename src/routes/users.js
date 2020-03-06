let userController = require('../controllers/userController');
let login = require('../controllers/auth/login');
const express = require('express');
let router = express.Router();

  /**
   * USERS LIST (only for Admin)
   */
  router.get("/", login.verifyToken, userController.get);

  /**
   * SPECIFIC USER (with his id in parameter)
   */
  router.get('/:id', login.verifyToken, (req, res) => {
    var id = req.params.id;
    userController.user_info_get(id,req,res);
});

  router.post('/:id', login.verifyToken, (req, res) => {
    var id = req.params.id;
    userController.user_info_post(id,req,res);
});
  
  /**
   * MODIFY USER (his account)
   */
  router.get("/profile/update", login.verifyToken, userController.update_get);
  router.put("/profile/update", login.verifyToken, userController.update_post);

  /**
   * DELETE USER (only admin)
   */
  router.delete("/delete/:id", login.verifyToken,(req, res) => {
    let id = req.params.id;
    let from = false; //var to know if the delete form is from the user and not an admin 
    userController.delete_account(id,from,req,res);
  });

  /**
   * DELETE MY ACCOUNT
   */
  router.delete("/profile/delete/:id", login.verifyToken, (req, res) => {
      let id = req.params.id;
      let from = true; //var to know if the delete form is from the user and not an admin 
      userController.delete_account(id,from,req,res);
  });

module.exports = router;