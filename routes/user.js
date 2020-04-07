const express = require('express');
const passport = require('passport');
const UserService = require('../services/auth');
const permit = require('../middlewares/permission');

const router = express.Router();

/* GET users listing. */
router.get('/:id?', permit('admin'), async (req, res) => {
  res.send(await UserService.getUsers(req.params.id));
});

router.post('/', permit('admin'), async (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.status(400).send('Missing parameter(s).');
  }
  try {
    const newUser = await UserService.createUser(req.body.username, req.body.password);
    res.send(newUser);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.patch('/:id', permit('admin'), async (req, res) => {
  try {
    await UserService.updateUser(req.params.id, req.body);
  } catch (e) {
    res.send(e.message);
  }
  res.send('Success.');
});

router.delete('/:id', permit('admin'), async (req, res) => {
  try {
    await UserService.deleteUser(req.params.id);
  } catch (e) {
    res.send(e.message);
  }
  res.send('Success.');
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
  if (!req.body.username || !req.body.password) {
    res.status(400).send('Missing parameter(s).');
  }
  try {
    const newUser = await UserService.register(req.body.username, req.body.password);
    res.send(newUser);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get('/manage', permit('admin'), (req, res) => {
  res.send('Access granted!');
});

module.exports = router;
