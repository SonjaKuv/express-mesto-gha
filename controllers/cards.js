const { StatusCodes } = require('http-status-codes');
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
    .then((cards) => res.status(StatusCodes.CREATED).send({ data: cards }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(StatusCodes.BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные при создании карточки' });
      }
      return next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .orFail(() => res.status(StatusCodes.NOT_FOUND).send({ message: 'Карточка с указанным id не найдена' }))
    .then((card) => {
      Card.findByIdAndRemove(cardId)
        .then(() => res.send(card))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(StatusCodes.BAD_REQUEST)
          .send({ message: 'Передан некорректный формат id' });
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => Card.findByIdAndUpdate(
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
        .send({ message: 'Передан некорректный формат id' });
    } else if (err.name === 'ValidationError') {
      res.status(StatusCodes.BAD_REQUEST)
        .send({ message: 'Переданы некорректные данные для лайка' });
    }
    return next(err);
  });

module.exports.dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
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
        .send({ message: 'Передан некорректный формат id' });
    } else if (err.name === 'ValidationError') {
      res.status(StatusCodes.BAD_REQUEST)
        .send({ message: 'Переданы некорректные данные для удаления лайка' });
    }
    return next(err);
  });
