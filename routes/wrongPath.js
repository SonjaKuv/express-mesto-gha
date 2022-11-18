const { StatusCodes } = require('http-status-codes');
const router = require('express').Router();

router.use((req, res) => {
  res.status(StatusCodes.NOT_FOUND).send({ message: 'Данный путь не найден' });
});

module.exports = router;
