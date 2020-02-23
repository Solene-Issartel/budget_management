let http = require('http');
let hbs = require('express-handlebars');
let express = require('express');
let routes = require('./routes');
let middlewares = require('../src/middlewares');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');

let app = express();

let router = express.Router();
let server = http.createServer(app);

app.engine('handlebars', hbs({
    extname: 'handlebars',
    defaultLayout: 'layapp',
    layoutsDir: __dirname + '/../src/views/layouts'
}));

app.use(express.static('public'));
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/../src/views');

/**
 * BODY PARSER : allow to handle body request/response
 */
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

/**
 * COOKIE PARSER : allow to handle cookies
 */
app.use(cookieParser());

routes.makeRoutes(app);

// if(process.env.NODE_ENV == "production"){
//    serverhttps.listen(8080);
// } else {
   server.listen(8080);



module.exports = app;