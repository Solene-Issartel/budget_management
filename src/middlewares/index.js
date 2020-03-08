let parser = require('./parser');
let helpers = require('./helpers');

module.exports.makeMiddlewares = function (app){
    
    parser.parserMiddlewares(app);

    helpers.helpersMiddlewares(app);
    
    return app;

}