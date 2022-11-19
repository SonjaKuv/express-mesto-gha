const { StatusCodes } = require('http-status-codes');
const logger = require('../logger');
const User = require('../models/users');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(StatusCodes.OK).send({ data: users }))
    .catch((err) => {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      logger.error(err);
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((users) => res.status(StatusCodes.CREATED).send({ data: users }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(StatusCodes.BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
        logger.error(err);
      }
    });
};

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (user === null) {
        res.status(StatusCodes.NOT_FOUND)
          .send({ message: 'Пользователь по указанному _id не найден' });
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(StatusCodes.BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
        logger.error(err);
      }
    });
};

module.exports.setNewProfileInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user === null) {
        res.status(StatusCodes.NOT_FOUND)
          .send({ message: 'Пользователь с указанным _id не найден' });
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(StatusCodes.BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные при обновлении профиля' });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
        logger.error(err);
      }
    });
};

module.exports.setNewAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user === null) {
        res.status(StatusCodes.NOT_FOUND)
          .send({ message: 'Пользователь с указанным _id не найден' });
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(StatusCodes.BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные при обновлении аватара' });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
        logger.error(err);
      }
    });
};
