let http = require('http');
let hbs = require('express-handlebars');
let express = require('express');
let routes = require('./routes');
let middlewares = require('../src/middlewares');
var methodOverride = require('method-override')
var app = express();
let setupMiddlewares = require('./middlewares').makeMiddlewares;
 
const PORT = process.env.PORT || 8080;
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

let server = http.createServer(app);

app.engine('handlebars', hbs({
    extname: 'handlebars',
    defaultLayout: 'layapp',
    layoutsDir: __dirname + '/../src/views/layouts'
}));

app.use(express.static('public'));
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/../src/views');

setupMiddlewares(app);

routes.makeRoutes(app);

server.listen(PORT);



module.exports = app;
