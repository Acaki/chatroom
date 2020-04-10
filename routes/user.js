const express = require('express');
const passport = require('passport');
const UserService = require('../services/auth');
const permit = require('../middlewares/permission');
const { DuplicateRegisterError, UserNotExistsError, PasswordInvalidError } = require('../services/error');

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
    res.status(303).send(e);
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

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) {
      if (err instanceof UserNotExistsError) {
        return res.status(401).json({ username: err.message });
      }
      if (err instanceof PasswordInvalidError) {
        return res.status(401).json({ password: err.message });
      }
      return res.status(500).json(err);
    }
    return req.logIn(user, (error) => {
      if (error) {
        return res.status(500).json(error);
      }
      if (user.role === 'admin') {
        return res.json({ loggedUser: user, redirectUri: '/userList' });
      }
      return res.json({ loggedUser: user, redirectUri: '/chatroom' });
    });
  })(req, res, next);
});

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
    return res.json({ loggedUser: newUser, redirectUri: '/chatroom' });
  } catch (e) {
    if (e instanceof DuplicateRegisterError) {
      res.status(303).json({ username: e.message });
    } else {
      res.status(500).json(e);
    }
  }
});

router.get('/manage', permit('admin'), (req, res) => {
  res.send('Access granted!');
});

module.exports = router;
