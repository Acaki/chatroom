class DuplicateRegisterError extends Error {
  constructor(message = 'The username is already taken.') {
    super(message);
    this.name = 'DuplicateError';
  }
}

class UserNotExistsError extends Error {
  constructor(message = 'The user does not exist.') {
    super(message);
    this.name = 'UserNotExistsError';
  }
}

class PasswordInvalidError extends Error {
  constructor(message = 'Password invalid.') {
    super(message);
    this.name = 'PasswordInvalidError';
  }
}

module.exports = {
  DuplicateRegisterError,
  UserNotExistsError,
  PasswordInvalidError,
};
