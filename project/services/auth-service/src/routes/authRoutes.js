import express from 'express';
import { signup, login, getMe } from '../controllers/authController.js';

const router = express.Router();

// Public routes for user onboarding
router.post('/signup', signup);
router.post('/login', login);

// Protected route to get own profile (Uses JWT Bearer)
router.get('/me', getMe);

export default router;
