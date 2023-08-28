import express from 'express';
import jwt from 'jsonwebtoken'; 
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

import { validationResult } from 'express-validator';
import { reqisterValidation } from './validations/auth.js';
import UserModel from './models/User.js';

mongoose
.connect('mongodb+srv://sensem2012:xF7HJ3N5RpP5J1ce@cluster0.xz023gx.mongodb.net/?retryWrites=true&w=majority')
.then(() => console.log('DB okey'))
.catch((err) => console.log('DB error', err));

const app = express();

app.use(express.json());

app.post('/auth/reqister', reqisterValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }

  const password = req.body.password;
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const doc = new UserModel({
    email: req.body.email,
    fullName: req.body.fullName,
    avatarUrl: req.body.avatarUrl,
    passwordHash,
  });

  const user = await doc.save();

  res.json(user);
});

app.listen(4444, (err) => {
  if (err) {
    console.error(err);
  }

  console.log('Server OK!');
});