let http = require('http');
let hbs = require('express-handlebars');
let express = require('express');
let routes = require('./routes');
let middlewares = require('../src/middlewares');
var methodOverride = require('method-override')
var app = express();
let setupMiddlewares = require('./middlewares').makeMiddlewares;
const catRouter = require('./routes/categories')
const listRouter = require('./routes/lists')
const prodRouter = require('./routes/products')
const userRouter = require('./routes/users')
const profilRouter = require('./routes/profiles')
const graphRouter = require('./routes/graphs')
const indexRouter = require('./routes')

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

app.use('/', indexRouter)
app.use('/categories', catRouter)
app.use('/lists', listRouter)
app.use('/users', userRouter)
app.use('/profile', profilRouter)
app.use('/products', prodRouter)
app.use('/graphs', graphRouter)


server.listen(PORT);



module.exports = app;
