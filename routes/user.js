const express = require('express');
const passport = require('passport');
const UserService = require('../services/auth');
const permit = require('../middlewares/permission');
const authorize = require('../middlewares/authentication');

const router = express.Router();

/* GET users listing. */
router.get('/', (req, res) => {
  res.send('respond with a resource');
});

router.post('/login', passport.authenticate(
  'local',
  { successRedirect: '/', failedRedirect: '/login' },
));

router.post('/logout', (req, res) => {
  req.logout();
  res.send(null);
});

router.post('/register', async (req, res) => {
  try {
    const newUser = await UserService.register(req.body.username, req.body.password);
    res.send(newUser).end();
  } catch (e) {
    res.send(e.message).end();
  }
});

router.patch('/role', permit('admin'), async (req, res) => {
  try {
    await UserService.updateRole(req.user.name, req.body.role);
  } catch (e) {
    res.send(e.message).end();
  }
  res.send('Success.');
});

router.get('/manage', permit('admin'), (req, res) => {
  res.send('Access granted!');
});

module.exports = router;
