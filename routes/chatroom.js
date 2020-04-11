const express = require('express');
const permit = require('../middlewares/permission');
const models = require('../models');

const router = express.Router();

router.get('/messages', permit, async (req, res) => {
  const messages = await models.ChatMessages.findAll({
    include: [{ model:models.User, as: 'user' }],
  });
  try {
    res.send(messages);
  } catch (e) {
    res.send([]);
  }
});

module.exports = router;
