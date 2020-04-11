const request = require('supertest');
const express = require('express');
const chatroomRouter = require('../../routes/chatroom');

jest.mock('../../middlewares/permission');
jest.mock('../../models');
const permit = require('../../middlewares/permission');
const models = require('../../models');
const app = express();
app.use(chatroomRouter);
permit.mockImplementation((req, res, next) => next());

describe('Chatroom APIs', () => {
  describe('GET /chatroom/messages', () => {
    it('should success.', (done) => {
      const expects = [{ id: 0 }];
      models.ChatMessages.findAll.mockReturnValue(expects);
      request(app)
        .get('/messages')
        .expect(200, expects, done);
    });
  });
});
