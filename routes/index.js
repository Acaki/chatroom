const express = require('express');
const UserService = require('../services/auth');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});

router.get('/login', (req, res) => {
  res.render('index');
});

router.get('/list_users', async (req, res) => {
  const allUsers = await UserService.getUsers();
  res.render('users', { users: allUsers });
});


module.exports = router;
