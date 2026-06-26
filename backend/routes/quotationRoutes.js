import express from 'express';
import { generate, save, history, pdf, share, remove } from '../controllers/quotationController.js';

const router = express.Router();

router.post('/generate', generate);
router.post('/save', save);
router.get('/history', history);
router.get('/pdf/:id', pdf);
router.get('/share/:id', share);
router.delete('/:id', remove);

export default router;
