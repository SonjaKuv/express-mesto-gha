// const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');

const { PORT = 3000 } = process.env;
const app = express();

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
app.use((req, res, next) => {
  next({ status: 400 });
});

app.use((req, res, next) => {
  next({ status: 404 });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json();
  next();
});

app.listen(PORT, () => {
  console.log('server has been started');
});
