const express = require('express');
const router = express.Router();
const passport = require('passport');
const models = require('../models');

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});

router.post('/login', passport.authenticate(
  'local',
  { successRedirect: '/', failedRedirect: '/login' },
));

router.post('/register', async (req, res) => {
  const existingUser = await models.User.findOne({
    where: {
      name: req.body.username,
    },
  });
  if (existingUser) {
    res.send('User already exists').end();
  }
  const newUser = await models.User.create({
    name: req.body.username,
    password: req.body.password,
  });

  res.send(newUser).end();
});

module.exports = router;
