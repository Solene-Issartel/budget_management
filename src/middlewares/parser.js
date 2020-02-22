let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');


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

  return app;
}