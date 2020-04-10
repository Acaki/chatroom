const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const passportJWT = require('passport-jwt');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const { UserNotExistsError, PasswordInvalidError } = require('./services/error');

const models = require('./models');
const indexRouter = require('./routes');
const usersRouter = require('./routes/user');
const chatRoomRouter = require('./routes/chatroom');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/chatroom', chatRoomRouter);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (user, done) => {
  done(null, await models.User.findByPk(user));
});

passport.use(new LocalStrategy(
  async (username, password, done) => {
    let user;
    try {
      user = await models.User.scope('withPassword').findOne({
        where: {
          name: username,
        },
      });
    } catch (e) {
      return done(e, false);
    }

    if (!user) {
      return done(new UserNotExistsError(), false);
    }
    if (!await user.validPassword(password)) {
      return done(new PasswordInvalidError(), false);
    }

    return done(null, user);
  },
));

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtToken,
}));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
