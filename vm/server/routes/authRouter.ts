import express from 'express';
import * as authController from '../controllers/authController';

const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/login', authController.login);
// Likely no longer needed, as id and token are stored in FE on localStorage while user is logged in, and removed on log out
router.get('/verify', authController.verifyToken, (req, res) => {
  res.send('Hello, user!');
});

export default router;
