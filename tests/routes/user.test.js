const request = require('supertest');
const express = require('express');
const passport = require('passport');
const should = require('chai').should();
const userRouter = require('../../routes/user');
const { UserNotExistsError, PasswordInvalidError, DuplicateRegisterError } = require('../../services/error');

jest.mock('../../middlewares/permission');
jest.mock('../../services/auth');
const permit = require('../../middlewares/permission');
const UserService = require('../../services/auth');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(userRouter);
permit.mockImplementation((req, res, next) => next());

describe('User APIs', () => {
  describe('GET /user', () => {
    it('should responds with json', (done) => {
      const expects = [{ id: 0 }];
      UserService.getUsers.mockReturnValue(expects);
      request(app)
        .get('/')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, expects, done);
    });
  });

  describe('POST /user', () => {
    it('should HTTP 400 when providing empty body', (done) => {
      request(app)
        .post('/')
        .expect(400, done);
    });

    it('should HTTP 400 when providing only username', (done) => {
      request(app)
        .post('/')
        .send({ username: 'username' })
        .expect(400, done);
    });

    it('should HTTP 400 when providing only password', (done) => {
      request(app)
        .post('/')
        .send({ password: 'password' })
        .expect(400, done);
    });

    it('should HTTP 303 when the user is already exists', (done) => {
      UserService.register.mockImplementation(async () => {
        throw new DuplicateRegisterError();
      });
      request(app)
        .post('/')
        .send({ username: 'username', password: 'password' })
        .expect(303, done);
    });
  });

  describe('PATCH /user', () => {
    it ('should success', (done) => {
      request(app)
        .patch('/0')
        .expect(200, 'Success.', done);
    });
  });

  describe('POST /user/login', () => {
    it('should HTTP 401 when the user does not exist.', (done) => {
      passport.authenticate = jest.fn((authType, callback) => () => {
        callback(new UserNotExistsError(), false);
      });
      request(app)
        .post('/login')
        .expect(401, done);
    });

    it('should HTTP 401 when the password is invalid.', (done) => {
      passport.authenticate = jest.fn((authType, callback) => () => {
        callback(new PasswordInvalidError(), false);
      });
      request(app)
        .post('/login')
        .expect(401, done);
    });

    it('should HTTP 500 when other error occurred.', (done) => {
      passport.authenticate = jest.fn((authType, callback) => () => {
        callback(new Error(), false);
      });
      request(app)
        .post('/login')
        .expect(500, done);
    });

    it('should HTTP 500 when login error occurred.', (done) => {
      passport.authenticate = jest.fn((authType, callback) => () => {
        callback(null, false);
      });
      // request.logIn = jest.fn((user, callback) => callback(new Error()));
      request(app)
        .post('/login')
        .expect(500, done);
    });

    it('should response admin redirect uri.', (done) => {
      passport.authenticate = jest.fn((authType, callback) => (req, res, next) => {
        req.logIn = jest.fn((user, cb) => cb(null));
        callback(null, { role: 'admin' });
      });
      request(app)
        .post('/login')
        .expect(200)
        .expect((res) => {
          res.body.should.have.property('loggedUser');
          res.body.should.have.property('loggedUser');
        })
        .end(done);
    });

    it('should response general redirect uri.', (done) => {
      passport.authenticate = jest.fn((authType, callback) => (req, res, next) => {
        req.logIn = jest.fn((user, cb) => cb(null));
        callback(null, { role: 'general' });
      });
      request(app)
        .post('/login')
        .expect(200)
        .expect((res) => {
          res.body.should.have.property('loggedUser');
          res.body.should.have.property('loggedUser');
        })
        .end(done);
    });
  });
});
