const router = require('express').Router();
const multer = require('multer');
const upload = multer();

const authController = require('../controllers/auth.controller');
const userController = require('../controllers/user.controller');
const uploadController = require('../controllers/upload.controller');

// == (Auth) Lorsque route : '/api/user/register', alors on déclenche authController.signUp
router.post('/register', authController.signUp); // S'inscrire
router.post('/login', authController.signIn); // Se loguer
router.get('/logout', authController.signOut); // Deco (retire le cookie token)

// == (User database)
router.get('/', userController.getAllUsers);
router.get('/:id', userController.userInfo);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.patch('/follow/:id', userController.follow);
router.patch('/unfollow/:id', userController.unfollow);

// Upload image
router.post('/upload', upload.single('file'), uploadController.uploadProfil);

module.exports = router;
