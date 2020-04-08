const express = require('express');
const models = require('../models');

const router = express.Router();

router.get('/messages', async (req, res) => {
  try {
    res.send(await models.ChatMessages.findAll());
  } catch (e) {
    res.send([]);
  }
});

module.exports = router;
