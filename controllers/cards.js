const { StatusCodes } = require('http-status-codes');
const Card = require('../models/cards');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(StatusCodes.OK).send({ data: cards }))
    .catch((err) => res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера', err }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((cards) => res.status(StatusCodes.CREATED).send({ data: cards }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(StatusCodes.BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные при создании карточки' });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => res.status(StatusCodes.OK).send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(StatusCodes.NOT_FOUND)
          .send({ message: 'Карточка с указанным _id не найдена' });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
)
  .then((card) => {
    if (card === null) {
      res.status(StatusCodes.NOT_FOUND)
        .send({ message: 'Передан несуществующий id карточки' });
    } else {
      res.send({ data: card });
    }
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(StatusCodes.BAD_REQUEST)
        .send({ message: 'Переданы некорректные данные для постановки лайка' });
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
    }
  });

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
)
  .then((card) => {
    if (card === null) {
      res.status(StatusCodes.NOT_FOUND)
        .send({ message: 'Передан несуществующий id карточки' });
    } else {
      res.send(card);
    }
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(StatusCodes.BAD_REQUEST)
        .send({ message: 'Переданы некорректные данные для снятии лайка' });
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
    }
  });
