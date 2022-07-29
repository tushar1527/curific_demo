import express from 'express';
import { paymentController } from '../controllers';
// import { authMiddleware } from '../middleware';

const router = express.Router();

// router.get('/get', authMiddleware, packageController.getPackage);
router.post('/create', paymentController.addPayment);
// router.put('/update/:id', authMiddleware, packageController.updatePackage);
// router.delete('/delete/:id', authMiddleware, packageController.deletePackage);

module.exports = router;
