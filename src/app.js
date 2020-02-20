let http = require('http');
let hbs = require('express-handlebars');
let express = require('express');
let routes = require('./routes');

let app = express();

let router = express.Router();
let server = http.createServer(app);

let bodyParser = require('body-parser');
   // support parsing of application/json type post data
app.use(bodyParser.json());
   //support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: false }));


app.engine('handlebars', hbs({
    extname: 'handlebars',
    defaultLayout: 'layapp',
    layoutsDir: __dirname + '/../src/views/layouts'
}));

app.use(express.static('public'));
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/../src/views');

routes.makeRoutes(app);


if(process.env.NODE_ENV == "production"){
   serverhttps.listen(8080);
} else {
   server.listen(8080);
}


module.exports = app;