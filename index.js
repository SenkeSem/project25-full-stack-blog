import express from 'express';
import multer from 'multer';
import cors from 'cors';

import mongoose, { get } from 'mongoose';

import { reqisterValidation, loginValidation, postCreateValidation } from './validations.js';

import { checkAuth, handleValidationErrors } from './utils/index.js';

import { UserController, PostController } from './controllers/index.js';

// Подключение к базе данных MongoDB через библиотеку mongoose.

mongoose
  .connect('mongodb+srv://sensem2012:xF7HJ3N5RpP5J1ce@cluster0.xz023gx.mongodb.net/blog?retryWrites=true&w=majority')
  .then(() => console.log('DB okey'))
  .catch((err) => console.log('DB error', err));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());

app.use('/uploads', express.static('uploads'));

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/reqister', reqisterValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

// CRUD функционал для статей.
app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);

// Удалять, создавать и редактировать --> Могут только авторизованные пользователи.
// Метод CheckAuth проверяет авторизован ли пользователь.
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id',checkAuth, postCreateValidation, handleValidationErrors, PostController.update);

app.listen(4444, (err) => {
  if (err) {
    console.error(err);
  }

  console.log('Server OK!');
});