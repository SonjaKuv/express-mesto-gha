const express = require('express');
const { celebrate, Joi, Segments } = require('celebrate');
const routerUsers = require('./users');
const routerCards = require('./cards');
const wrongPath = require('./wrongPath');
const { createUser, login } = require('../controllers/users');
const linkRegExp = require('../utils/constants');

const index = express();

index.post('/signin', celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().pattern(/\w{8,30}/).required().min(8),
  }),
}), login);
index.post('/signup', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(linkRegExp),
    email: Joi.string().required().email(),
    password: Joi.string().pattern(/\w{8,30}/).required().min(8),
  }),
}), createUser);

index.use(routerUsers);
index.use(routerCards);
index.use(wrongPath);

module.exports = index;
