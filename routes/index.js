const express = require('express');
const router = express.Router();
const passport = require('passport');

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});

router.post('/login',
  passport.authenticate('local', { failedRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  });

module.exports = router;
