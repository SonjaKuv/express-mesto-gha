const router = require('express').Router();
const { celebrate, Joi, Segments } = require('celebrate');
const {
  getUsers, getUserById, setNewProfileInfo, setNewAvatar, getUserInfo,
} = require('../controllers/users');
const auth = require('../middlewares/auth');
const linkRegExp = require('../utils/constants');

router.use(auth);

router.get('/users', getUsers);

router.get('/users/me', getUserInfo);

router.patch('/users/me', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().required().min(2).max(30),
  }),
}), setNewProfileInfo);

router.get('/users/:userId', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
}), getUserById);

router.patch('/users/me/avatar', celebrate({
  [Segments.BODY]: Joi.object().keys({
    avatar: Joi.string().required().pattern(linkRegExp),
  }),
}), setNewAvatar);

module.exports = router;
