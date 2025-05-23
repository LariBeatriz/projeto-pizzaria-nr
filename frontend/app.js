var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();
app.use(express.json());

// IMPORTANDO ROTAS DE /ROUTES
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var clientesRouter = require('./routes/clientes');
var produtosRouter = require('./routes/produtos');
var pedidosRouter = require('./routes/pedidos');

// DEFININDO ENDPOINT PARA AS ROTAS IMPORTADAS
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/clientes', clientesRouter);
app.use('/produtos', produtosRouter);
app.use('/pedidos', pedidosRouter);

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
