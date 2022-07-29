import express from 'express';
import { faqsController } from '../controllers';
import { authMiddleware } from '../middleware';

const router = express.Router();

router.get('/get', faqsController.getFAQS);
router.post(
	'/create',
	authMiddleware,

	faqsController.getFAQS,
);
router.put('/update/:id', authMiddleware, faqsController.updateFAQS);
router.delete('/delete/:id', authMiddleware, faqsController.deleteFAQS);

module.exports = router;
