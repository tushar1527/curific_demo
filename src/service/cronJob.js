import moment from 'moment';
import schedule from 'node-schedule';
import { drService, scheduleAppointmentService } from '../mongoServices';
require('dotenv').config({ path: 'src/config/.env' });
let timeSlot = new Date(process.env.CRONTIMESLOT);
let time = new Date(
	timeSlot.getFullYear(),
	timeSlot.getMonth(),
	timeSlot.getDate(),
	13,
	9,
	0,
);
let date = moment('2012-11-26 14:40:00')
	.utcOffset('+05:30')
	.format('YYYY-MM-DD HH:mm');
console.log('date', date);
// const date = new Date(2012, 11, 21, 5, 30, 0);
schedule.scheduleJob(date, async () => {
	console.log('aaa');
	try {
		let days = process.env.DAYS;

		const { data: dr } = await drService.findAllQuery({});
		for (let i = 0; i < days; i++) {
			for (const element of dr) {
				for (const slot of element.timeSlot) {
					const startDate = moment()
						.add(i, 'days')
						.startOf('day')
						.toISOString();
					const endDate = moment().add(i, 'days').endOf('day').toISOString();
					let filter = {
						drId: element._id,
						date: { $gte: startDate, $lte: endDate },
						timeSlotId: slot._id,
					};
					const { data: appointment } =
						await scheduleAppointmentService.findAllQuery(filter);
					if (appointment.length === 0) {
						let payload = {
							drId: element._id,
							timeSlotId: slot._id,
							date: moment(startDate).add(8, 'hours').toISOString(),
						};
						let createTimeSlot = new monthlyTimeSlotModel(payload);
						await createTimeSlot.save();
					}
				}
			}
		}
		return res.status(200).json({
			success: true,
			message: 'Time slot created successfully',
		});
	} catch (error) {
		console.log('error', error);
		// errorLogger(error.message, req.originalUrl, req.ip);
		return res.status(500).json({
			success: false,
			error: error,
		});
	}
});
