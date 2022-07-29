import express from 'express';
import { monthlyTimeSlotController } from '../controllers';

const router = express.Router();

router.post(
	'/create',
	// authMiddleware,
	monthlyTimeSlotController.createMonthlyTimeSlot,
);

router.post(
	'/get',
	// authMiddleware,
	monthlyTimeSlotController.getTodayTimeSlot,
);

module.exports = router;
