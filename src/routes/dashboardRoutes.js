import express from 'express';
import { dashBoardController } from '../controllers';
const router = express.Router();

router.get('/', dashBoardController.getDashboard);

module.exports = router;
