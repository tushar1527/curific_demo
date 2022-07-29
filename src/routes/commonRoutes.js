import express from 'express';
import { commonController } from '../controllers';
import { authMiddleware } from '../middleware';
const router = express.Router();

router.post('/createConsult', authMiddleware, commonController.createConsult);
router.post('/createLanguage', authMiddleware, commonController.createLanguage);

router.get(
	'/getAllLanguage/:id?',
	authMiddleware,
	commonController.getAllLanguage,
);
router.get(
	'/getAllConsult/:id?',
	authMiddleware,
	commonController.getAllConsult,
);

router.post(
	'/updateLanguage/:id',
	authMiddleware,
	commonController.updateLanguage,
);
router.post(
	'/updateConsult/:id',
	authMiddleware,
	commonController.updateConsult,
);

router.delete(
	'/deleteLanguage/:id',
	authMiddleware,
	commonController.deleteLanguage,
);
router.delete(
	'/deleteConsult/:id',
	authMiddleware,
	commonController.deleteConsult,
);

module.exports = router;
