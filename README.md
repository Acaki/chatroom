# Chatroom backend
Entry: https://api-dot-practice-272116.appspot.com/

Simple chat app backend implemented with Express.

### How to run
Make sure you have `node` and `npm` installed
* Run `npm run start` to start a local server at `localhost:3000`
* Run `num run devstart` to start a local server that automatically reloads at file change event.
* Run `num run test` to run all tests.

Note: You can set environment variable `PORT` to run the server on different port.

### Deployment
* `gcloud auth login`
* `gcloud app deploy api.yaml`


### DB schema

![DB schema](https://user-images.githubusercontent.com/10175554/79054194-899ce480-7c75-11ea-8354-51f10c88382b.png)

