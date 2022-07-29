import express from 'express';
import { appointmentController } from '../controllers';
import { customerMiddleware, authMiddleware } from '../middleware';
const router = express.Router();

router.post(
	'/create',
	customerMiddleware,
	appointmentController.createAppointment,
);

router.get('/get', appointmentController.getAppointment);

router.put(
	'/update/:id',
	customerMiddleware,
	appointmentController.updateAppointment,
);

router.delete(
	'/delete/:id',
	authMiddleware,
	appointmentController.deleteAppointment,
);

module.exports = router;
