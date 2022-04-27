const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
require('dotenv').config();
const app = express();
const auth = require('./middelwares/auth');
// establishing a connection between the server and the application
mongoose.connect('mongodb://127.0.0.1:27017/podcast', (err) => {
  console.log(err ? err : 'Connected true');
});
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const podcastRouter = require('./routes/podcasts');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// session middelware
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

app.use(flash());
app.use(auth.userInformation);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/podcasts', podcastRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
