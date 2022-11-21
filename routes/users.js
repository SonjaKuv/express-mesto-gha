const router = require('express').Router();
const {
  getUsers, getUserById, setNewProfileInfo, setNewAvatar, getUserInfo,
} = require('../controllers/users');
const auth = require('../middlewares/auth');

router.get('/users', auth, getUsers);
router.get('/users/:userId', auth, getUserById);
router.get('/users/me', auth, getUserInfo);
router.patch('/users/me', auth, setNewProfileInfo);
router.patch('/users/me/avatar', auth, setNewAvatar);

module.exports = router;
