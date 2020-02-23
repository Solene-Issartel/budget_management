let register = require('../controllers/auth/register');
let login = require('../controllers/auth/login');
let jwt = require('jsonwebtoken');
let express = require('express');
let usersRoutes = require('./users');

module.exports.makeRoutes = function (app){

  /**
   * WELCOME PAGE ROUTE
   */
  app.get('/', (req, res) => {
    res.render('index', { title : 'Accueil'});
  })

   /**
   * HOME PAGE ROUTE
   */
  app.get('/home', login.verifyToken, login.home);

  /**
   * REGISTER ROUTES
   */
  app.get('/register', register.get);
  app.post("/register", register.post);

  /**
   * LOGIN ROUTES
   */
  app.get('/login', login.get);
  app.post('/login', login.post);

  /**
   * This route will "logout" the user (impossible with jsonwebtoken because it's stateless)
   */
  app.get('/logout', (req, res) => {
      req.user = {};
      req.cookies.token = null;
      res.redirect("/login");
  });

  /**
   * Call other methods to get all the routes
   */
  usersRoutes.usersRoutes(app);

  return app;
}