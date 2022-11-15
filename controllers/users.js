const { StatusCodes } = require('http-status-codes');
const BadRequestError = require('../errors/BadRequest');
const NotFoundError = require('../errors/NotFound');
const InternalServerError = require('../errors/InternalServer');
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
        next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      } else {
        next(new InternalServerError('Произошла внутренняя ошибка сервера'));
      }
      next(err);
    });
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (user === null) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорректный формат id'));
      } else {
        next(new InternalServerError('Произошла внутренняя ошибка сервера'));
      }
      next(err);
    });
};

module.exports.setNewProfileInfo = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.params.name, about: req.params.about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user === null) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
      } else {
        next(new InternalServerError('Произошла внутренняя ошибка сервера'));
      }
      next(err);
    });
};

module.exports.setNewAvatar = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.params.avatar },
    { new: true },
  )
    .then((user) => {
      if (user === null) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении аватара'));
      } else {
        next(new InternalServerError('Произошла внутренняя ошибка сервера'));
      }
      next(err);
    });
};
