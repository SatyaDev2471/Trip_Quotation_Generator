import express from 'express';
import { generate, save, history, pdf, share } from '../controllers/quotationController.js';

const router = express.Router();

router.post('/generate', generate);
router.post('/save', save);
router.get('/history', history);
router.get('/pdf/:id', pdf);
router.get('/share/:id', share);

export default router;
