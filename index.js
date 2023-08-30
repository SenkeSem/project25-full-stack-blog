import express from 'express';
import mongoose, { get } from 'mongoose';
import { reqisterValidation, loginValidation, postCreateValidation } from './validations.js';
import checkAuth from './utils/checkAuth.js';

import * as UserController from './controllers/UserController.js';
import * as PostController from './controllers/PostController.js';

mongoose
  .connect('mongodb+srv://sensem2012:xF7HJ3N5RpP5J1ce@cluster0.xz023gx.mongodb.net/blog?retryWrites=true&w=majority')
  .then(() => console.log('DB okey'))
  .catch((err) => console.log('DB error', err));

const app = express();

app.use(express.json());

app.post('/auth/login', loginValidation,UserController.login);
app.post('/auth/reqister', reqisterValidation, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

// app.get('/posts', PostController.getAll);
// app.get('/posts/:id', PostController.getOne);
app.post('/posts', postCreateValidation, PostController.create);
// app.delete('/posts', PostController.remove);
// app.patch('/posts', PostController.update);

app.listen(4444, (err) => {
  if (err) {
    console.error(err);
  }

  console.log('Server OK!');
});