var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


const api = require('./routes/api');
var app = express();

const mongoose = require('mongoose');

// URI de la Facultad (Mongo corriendo local en el servidor, puerto 27017)
const defaultUri = 'mongodb://PSI046:PSI046@localhost:27017/PSI046?retryWrites=true&authSource=PSI046';

// Permitimos sobreescribir vía env var MONGO_URI
const mongoUri = process.env.MONGO_URI || defaultUri;

mongoose.connect(mongoUri)
  .then(() => console.log('✅ Conectado a la BD de la Facultad'))
  .catch(err => console.error('❌ Error conectando a la BD:', err));

  
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/', api);

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
