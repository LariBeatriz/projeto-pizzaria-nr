var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var bodyParser = require('body-parser');

var app = express();
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));

// Configuração da sessão
app.use(session ({
  secret: 'c9466fb2ab01e267aba80cc84a526cfdd6fa0420293a8770a30bc95d25a30194', // Chave: projeto-pizzaria-nr
  resave: false,
  saveUninitialized: true, 
  cookie: { secure: false } // true se usar HTTPS
}));

// IMPORTANDO ROTAS DE /ROUTES
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var clientesRouter = require('./routes/clientes');
var produtosRouter = require('./routes/produtos');
var pedidosRouter = require('./routes/pedidos');
var authRouter = require('./routes/auth');

// DEFININDO ENDPOINT PARA AS ROTAS IMPORTADAS
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/clientes', clientesRouter);
app.use('/produtos', produtosRouter);
app.use('/pedidos', pedidosRouter);
app.use('/login', authRouter);

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
  res.render('error');
});

module.exports = app;
