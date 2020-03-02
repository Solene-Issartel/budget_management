let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let csrf = require('csurf')


module.exports.parserMiddlewares = function (app){

    
    /**
     * BODY PARSER : allow to handle body request/response
     */
    app.use(bodyParser.json());
    
    app.use(bodyParser.urlencoded({ extended: false }));

    /**
     * COOKIE PARSER : allow to handle cookies
     */
    app.use(cookieParser());

        
    var csrfProtection = csrf({ cookie: true });
    app.use(csrfProtection);

  return app;
}