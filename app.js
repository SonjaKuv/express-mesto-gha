const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');
const wrongPath = require('./routes/wrongPath');
const { createUser, login } = require('./controllers/users');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/signin', login);
app.post('/signup', createUser);
app.use(routerUsers);
app.use(routerCards);
app.use(wrongPath);

mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => console.log('connected to db'))
  .catch((err) => console.log('error', err));

app.listen(PORT, () => {
  console.log('server has been started');
});
