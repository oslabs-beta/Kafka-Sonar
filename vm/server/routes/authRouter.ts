import express from 'express';
import * as authController from '../controllers/authController';

const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/login', authController.login);
router.get('/verify', authController.verifyToken, (req, res) => {
  res.send('Hello, user!');
});

export default router;