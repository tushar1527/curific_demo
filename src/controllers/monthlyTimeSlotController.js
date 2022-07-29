import _ from 'lodash';
import moment from 'moment';
import { monthlyTimeSlotModel } from '../models';
import {
	drService,
	scheduleAppointmentService,
	monthlyTimeService,
} from '../mongoServices';
const createMonthlyTimeSlot = async (_req, res) => {
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
};
const getTodayTimeSlot = async (req, res) => {
	try {
		let { date } = req.body;
		const { data } = await monthlyTimeService.getDailyTimeSlot({
			date,
		});
		let getAllTimeSlot = [];

		data.map((item) => {
			item.timeSlot.map((y) => {
				getAllTimeSlot.push(y);
			});
		});
		getAllTimeSlot = _.uniqBy(getAllTimeSlot, 'startTime');

		return res.status(200).json({
			success: true,
			message: 'Time slot fetched successfully',
			data: getAllTimeSlot,
		});
	} catch (error) {
		console.log('error', error);
		// errorLogger(error.message, req.originalUrl, req.ip);
		return res.status(500).json({
			success: false,
			error: error,
		});
	}
};

export default {
	createMonthlyTimeSlot,
	getTodayTimeSlot,
};
