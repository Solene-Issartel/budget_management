let Handlebars = require('handlebars');

module.exports.helpersMiddlewares = function (app){

    Handlebars.registerHelper('ifEq', function(var1, var2, options) {
        if(var1 === var2) {
          return options.fn(this);
        }
        return options.inverse(this);
      });

  return app;
}