let register = require('../controllers/auth/register');
let login = require('../controllers/auth/login');
let services = require('../services');
const express = require('express');
let router = express.Router();

  /**
   * WELCOME PAGE ROUTE
   */
  router.get('/', (req, res) => {
    let token = req.cookies.token;
    if(token){
      res.render('index', { title : 'Accueil'});
    } else {
      res.render('index', { title : 'Accueil', layout: 'layhome'});
    }
    
  })

   /**
   * HOME PAGE ROUTE
   */
  router.get('/home', login.verifyToken, login.home);

  router.post("/sendMail", login.verifyToken, services.users.sendMail);

  /**
   * REGISTER ROUTES
   */
  router.get('/register', register.get);
  router.post("/register", register.post);

  /**
   * LOGIN ROUTES
   */
  router.get('/login', login.get);
  router.post('/login', login.post);

  /**
   * This route will "logout" the user (impossible with jsonwebtoken because it's stateless)
   */
  router.get('/logout', (req, res) => {
      res.cookie('token', '', { maxAge: 0, httpOnly: true })
      res.redirect("/login");
  });

  module.exports = router;