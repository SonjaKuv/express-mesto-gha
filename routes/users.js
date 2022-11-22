const router = require('express').Router();
const { celebrate, Joi, Segments } = require('celebrate');
const {
  getUsers, getUserById, setNewProfileInfo, setNewAvatar, getUserInfo,
} = require('../controllers/users');
const auth = require('../middlewares/auth');

router.get('/users', auth, getUsers);

router.get('/users/:userId', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
}), auth, getUserById);

router.get('/users/me', auth, getUserInfo);

router.patch('/users/me', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30)
      .required(),
    about: Joi.string().required().min(2).max(30),
  }),
}), auth, setNewProfileInfo);

router.patch('/users/me/avatar', celebrate({
  [Segments.BODY]: Joi.object().keys({
    avatar: Joi.string().required().pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()\-._~:\/?#[\]@!\$&'\(\)\*\+,;=]*#?)/),
  }),
}), auth, setNewAvatar);

module.exports = router;
