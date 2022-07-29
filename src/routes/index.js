import express from 'express';
const router = express.Router();

router.use('/permissions', require('./adminManagement/permissionsRoutes'));
router.use('/role', require('./adminManagement/roleRoutes'));
router.use('/admin-user', require('./adminManagement/adminUserRoutes'));
router.use('/user', require('./userRoutes'));
router.use('/speciality', require('./specialityRoutes'));
router.use('/common', require('./commonRoutes'));
router.use('/notificationType', require('./notificationTypeRoutes'));
router.use('/device', require('./deviceRoutes'));
router.use('/settingManagement', require('./settingRoutes'));
router.use('/healthArticle', require('./healthRoutes'));
router.use('/settings', require('./settingRoutes'));
router.use('/timeSlot', require('./timeSlotRoute'));
router.use('/package', require('./packageRoutes'));
router.use('/dashboard', require('./dashboardRoutes'));
router.use('/faq', require('./faqRoute'));
router.use('/appointment', require('./appointmentRoute'));
router.use('/payment', require('./paymentRoute'));
router.use('/image', require('./uploadRoutes'));
router.use('/scheduleAppointment', require('./scheduleAppointment'));
router.use('/monthlyTimeSlot', require('./monthlyTimeSlotRoute'));

module.exports = router;
