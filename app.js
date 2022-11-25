const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, Segments, errors } = require('celebrate');
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');
const wrongPath = require('./routes/wrongPath');
const { createUser, login } = require('./controllers/users');
const handleError = require('./middlewares/handleError');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/signin', celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().pattern(/\w{8,30}/).required().min(8),
}),
 }), login);
app.post('/signup', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()\-._~:\/?#[\]@!\$&'\(\)\*\+,;=]*#?)/),
    email: Joi.string().required().email(),
    password: Joi.string().pattern(/\w{8,30}/).required().min(8),
}),
 }), createUser);
app.use(routerUsers);
app.use(routerCards);
app.use(wrongPath);
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
  next();
});

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  autoIndex: true,
})
  .then(() => console.log('connected to db'))
  .catch((err) => console.log('error', err));

app.listen(PORT, () => {
  console.log('server has been started');
});
