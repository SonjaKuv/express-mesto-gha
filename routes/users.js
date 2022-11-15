const router = require('express').Router();
const {
  getUsers, createUser, getUserById, setNewProfileInfo, setNewAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:userId', getUserById);
router.post('/users', createUser);
router.patch('/users/me', setNewProfileInfo);
router.patch('/users/me/avatar', setNewAvatar);

router.use((req, res) => {
  res.status(404).send({ message: 'Страница по указанному маршруту не найдена' });
});

module.exports = router;
