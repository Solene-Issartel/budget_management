let parser = require('./parser');

module.exports.makeMiddlewares = function (app){
    
    parser.parserMiddlewares(app);
    
    return app;

}