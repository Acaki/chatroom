const createError = require('http-errors');
const express = require('express');
const path = require('path');
const session = require('express-session');
const logger = require('morgan');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const cors = require('cors');

const models = require('./models');
const indexRouter = require('./routes');
const usersRouter = require('./routes/user');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session(
  {
    secret: 'anything',
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
      db: models.sequelize,
    }),
  },
));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/user', usersRouter);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (user, done) => {
  done(null, await models.User.findByPk(user));
});

passport.use(new LocalStrategy(
  async (username, password, done) => {
    const user = await models.User.findOne({
      where: {
        name: username,
      },
    });
    if (!user || !await user.validPassword(password)) { return done(null, false); }

    return done(null, user);
  },
));

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
