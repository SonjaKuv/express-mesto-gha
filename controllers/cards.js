const { StatusCodes } = require('http-status-codes');
const BadRequestError = require('../errors/BadRequest');
const NotFoundError = require('../errors/NotFound');
const InternalServerError = require('../errors/InternalServer');
const Card = require('../models/cards');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(StatusCodes.OK).send({ data: cards }))
    .catch((err) => {
      throw err;
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(StatusCodes.CREATED).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      } else {
        next(new InternalServerError('Произошла внутренняя ошибка сервера'));
      }
      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => {
      if (card === null) {
        throw new NotFoundError('Карточка c указанным id не найдена');
      }
      return card;
    })
    .then((card) => card.delete())
    .then((data) => res.send(data))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорректный формат id'));
      } else {
        next(new InternalServerError('Произошла внутренняя ошибка сервера'));
      }
      next(err);
    });
};

module.exports.likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
)
  .then((card) => {
    if (card === null) {
      throw new NotFoundError('Передан несуществующий id карточки');
    } else {
      res.send({ data: card });
    }
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new BadRequestError('Передан некорректный формат id'));
    } else if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные для лайка'));
    } else {
      next(new InternalServerError('Произошла внутренняя ошибка сервера'));
    }
    next(err);
  });

module.exports.dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
)
  .then((card) => {
    if (card === null) {
      throw new NotFoundError('Передан несуществующий id карточки');
    } else {
      res.send(card);
    }
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new BadRequestError('Передан некорректный формат id'));
    } else if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные для удаления лайка'));
    } else {
      next(new InternalServerError('Произошла внутренняя ошибка сервера'));
    }
    next(err);
  });
