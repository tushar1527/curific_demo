import express from 'express';

import { healthController } from '../controllers';
import { authMiddleware } from '../middleware';

const router = express.Router();

router.post('/create', authMiddleware, healthController.createHealthArticle);
router.delete(
	'/delete/:id',
	authMiddleware,
	healthController.deleteHealthArticle,
);
router.get('/get', healthController.getHealthArticle);
router.put(
	'/update/:id',
	authMiddleware,

	healthController.updateHealthArticle,
);

module.exports = router;
