module.exports.makeRoutes = function (app){

    // Home page route.
    app.get('/', (req, res) => {
      res.render('index', { title : 'Accueil'});
    })

}