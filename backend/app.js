var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

// Libs Auth
var rateLimit = require('express-rate-limit');
var session = require('express-session');

var app = express();
const cors = require('cors');
app.use(express.json());
app.use(cors());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Configuração do limite de requisições
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 3, // limite de 3 requisições por IP
  keyGenerator: (req, res) => req.headers['x-forwarded-for'] || req.ip
});

// Configuração da sessão
app.use(session ({
  secret: 'c9466fb2ab01e267aba80cc84a526cfdd6fa0420293a8770a30bc95d25a30194', // Chave: projeto-pizzaria-nr
  resave: false,
  saveUninitialized: true, 
  cookie: { secure: false } // true se usar HTTPS
}));

// Importe das rotas /routes...
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var clientesRouter = require('./routes/clientes');
var produtosRouter = require('./routes/produtos');
var pedidosRouter = require('./routes/pedidos');
var authRouter = require('./routes/auth');

// Define os ednpoints (recursos) para as rotas da API
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/clientes', clientesRouter);
app.use('/produtos', produtosRouter);
app.use('/pedidos', pedidosRouter);
app.use('/auth', limiter, authRouter);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send({error: 'Not found'});
});

module.exports = app;
