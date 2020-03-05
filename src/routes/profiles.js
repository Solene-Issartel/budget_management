let userController = require('../controllers/userController');
let login = require('../controllers/auth/login');
const express = require('express');
let router = express.Router();
  
  /**
   * MODIFY USER (his account)
   */
  router.get("/update", login.verifyToken, userController.update_get);
  router.put("/update", login.verifyToken, userController.update_post);

  /**
   * DELETE MY ACCOUNT
   */
  router.delete("/delete/:id", login.verifyToken, (req, res) => {
      let id = req.params.id;
      let from = true; //var to know if the delete form is from the user and not an admin 
      userController.delete_account(id,from,req,res);
  });

module.exports = router;