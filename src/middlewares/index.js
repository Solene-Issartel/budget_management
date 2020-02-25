let parser = require('./parser');
let helpers = require('./helpers');

let index = require('../routes')
let users = require('../routes/users')

module.exports.makeMiddlewares = function (app){
    
    parser.parserMiddlewares(app);

    helpers.helpersMiddlewares(app);
    
    return app;

}