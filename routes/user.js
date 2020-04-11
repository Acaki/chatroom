const express = require('express');
const passport = require('passport');
const UserService = require('../services/auth');
const permit = require('../middlewares/permission');
const { DuplicateRegisterError, UserNotExistsError, PasswordInvalidError } = require('../services/error');

const router = express.Router();

/* GET users listing. */
router.get('/:id?', (req, res, next) => { permit(req, res, next, 'admin'); }, async (req, res) => {
  res.json(await UserService.getUsers(req.params.id));
});

router.post('/', async (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.sendStatus(400);
    return;
  }
  let newUser;
  try {
    newUser = await UserService.register(req.body.username, req.body.password);
  } catch (e) {
    if (e instanceof DuplicateRegisterError) {
      res.status(303).json({ username: e.message });
      return;
    }
    res.status(500).json(e);
    return;
  }

  delete newUser.dataValues.password;
  res.json({ loggedUser: newUser, redirectUri: '/' });
});

router.patch('/:id', (req, res, next) => { permit(req, res, next, 'admin'); }, async (req, res) => {
  try {
    await UserService.updateUser(req.params.id, req.body);
  } catch (e) {
    res.send(e.message);
  }
  res.send('Success.');
});

router.delete('/:id', (req, res, next) => { permit(req, res, next, 'admin'); }, async (req, res) => {
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
      delete user.dataValues.password;
      if (user.role === 'admin') {
        return res.json({ loggedUser: user, redirectUri: '/userList' });
      }
      return res.json({ loggedUser: user, redirectUri: '/' });
    });
  })(req, res, next);
});

router.post('/logout', (req, res) => {
  req.logout();
  res.send(null);
});

module.exports = router;
