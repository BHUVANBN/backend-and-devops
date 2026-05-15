import express from 'express';
import upload from '../middlewares/uploadMiddleware.js';
import { uploadImage } from '../controllers/mediaController.js';

const router = express.Router();

/**
 * Upload Route
 * POST /api/v1/media/upload
 * 
 * Uses 'upload.single' middleware to handle single file uploads.
 * Requires Authentication (JWT verification - usually done via Gateway or generic middleware)
 */
router.post('/upload', upload.single('image'), uploadImage);

export default router;
