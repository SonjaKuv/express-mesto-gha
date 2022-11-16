// const { StatusCodes } = require('http-status-codes');
const router = require('express').Router();
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/cards', getCards);
router.post('/cards', createCard);
router.delete('/cards/:cardId', deleteCard);
router.put('/cards/:cardId/likes', likeCard);
router.delete('/cards/:cardId/likes', dislikeCard);

// router.use((req, res) => {
//   res
//     .status(StatusCodes.NOT_FOUND)
//     .send({ message: 'Страница по указанному маршруту не найдена' });
// });

module.exports = router;
