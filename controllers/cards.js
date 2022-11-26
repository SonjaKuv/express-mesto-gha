const { StatusCodes } = require('http-status-codes');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const Card = require('../models/cards');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.status(StatusCodes.OK).send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((cards) => res.status(StatusCodes.CREATED).send({ data: cards }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((card) => {
      if (card === null) {
        throw new NotFoundError('Удаление карточки с несуществующим в БД id');
      } else if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Удаление чужой карточки запрещено');
      } else {
        return card;
      }
    })
    .then((card) => card.delete())
    .then((data) => res.send(data))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

const changeLikeArray = (likeOperator, req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, likeOperator, { new: true })
    .then((card) => {
      if (card === null) {
        throw new NotFoundError('Передан несуществующий id карточки');
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  changeLikeArray({ $addToSet: { likes: req.user._id } }, req, res, next);
};

module.exports.dislikeCard = (req, res, next) => {
  changeLikeArray({ $pull: { likes: req.user._id } }, req, res, next);
};
