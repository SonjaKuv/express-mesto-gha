// const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');
const NotFoundError = require('./errors/NotFound');

const { PORT = 3000 } = process.env;
const app = express();
// const errorHandler = (err, req, res, next) => {
//   const statusCode = err.statusCode || 500;

//   const message = 'На сервере произошла ошибка';
//   res.status(statusCode).send({ message });
//   next();
// };

mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => console.log('connected to db'))
  .catch((err) => console.log('error', err));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.user = {
    _id: '63736c64848a71d88af760a9',
  };

  next();
});
app.use(routerUsers);
app.use(routerCards);
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(errorHandler);

app.use((req, res, next) => {
  next({ status: 404 });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json();
  next();
});

app.all('/*', () => {
  throw new NotFoundError('Запрашиваемый url не найден');
});

app.listen(PORT, () => {
  console.log('server has been started');
});
