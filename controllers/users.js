const { StatusCodes } = require('http-status-codes');
const User = require('../models/users');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(StatusCodes.OK).send({ data: users }))
    .catch((err) => {
      throw err;
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((users) => res.status(StatusCodes.CREATED).send({ data: users }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(StatusCodes.BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      return next(err);
    });
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (user === null) {
        res
          .status(StatusCodes.NOT_FOUND)
          .send({ message: 'Запрашиваемый пользователь не найден' });
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(StatusCodes.BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      return next(err);
    });
};

module.exports.setNewProfileInfo = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user === null) {
        res
          .status(StatusCodes.NOT_FOUND)
          .send({ message: 'Запрашиваемый пользователь не найден' });
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(StatusCodes.BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }
      return next(err);
    });
};

module.exports.setNewAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true },
  )
    .then((user) => {
      if (user === null) {
        res
          .status(StatusCodes.NOT_FOUND)
          .send({ message: 'Запрашиваемый пользователь не найден' });
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(StatusCodes.BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные при обновлении аватара' });
      }
      return next(err);
    });
};
