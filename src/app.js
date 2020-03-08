const http = require('http');
const hbs = require('express-handlebars');
const express = require('express');
const methodOverride = require('method-override')
const app = express();
const setupMiddlewares = require('./middlewares').makeMiddlewares;
const services = require('./services')
const catRouter = require('./routes/categories')
const listRouter = require('./routes/lists')
const prodRouter = require('./routes/products')
const userRouter = require('./routes/users')
const profilRouter = require('./routes/profiles')
const graphRouter = require('./routes/graphs')
const indexRouter = require('./routes')

// override with POST having ?_method=DELETE => works for the redirection router.delete but is'nt written in the request header...
app.use(methodOverride('_method'));

const PORT = process.env.PORT || 8080;
let server = http.createServer(app);

/**
 * Handlebars is used for the views
 */
app.engine('handlebars', hbs({
    extname: 'handlebars',
    defaultLayout: 'layapp',
    layoutsDir: __dirname + '/../src/views/layouts'
}))


/**
 * Relative way is defined at public
 */
app.use(express.static('public'));
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/../src/views');

/**
 * Set up middleware (parsers)
 */
setupMiddlewares(app);


/**
 * Routes are defined here and redirect to the right routes file.
 */
app.use('/', indexRouter)
app.use('/categories', catRouter)
app.use('/lists', listRouter)
app.use('/users', userRouter)
app.use('/profile', profilRouter)
app.use('/products', prodRouter)
app.use('/graphs', graphRouter)

/**
 * Create at the first time the server is launched in production , the super user
 */
services.init();

/**
 * Open the sever
 */
server.listen(PORT);



module.exports = app;
