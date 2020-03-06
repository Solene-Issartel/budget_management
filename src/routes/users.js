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
   * DELETE USER (only admin)
   */
  router.delete("/delete/:id", login.verifyToken,(req, res) => {
    let id = req.params.id;
    let from = false; //var to know if the delete form is from the user and not an admin 
    userController.delete_account(id,from,req,res);
  });

  /**
   * USer send a mail to the admin
   */
  router.post('/sendMail', login.verifyToken, userController.sendMail);

module.exports = router;