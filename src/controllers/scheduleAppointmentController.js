import {
	appointmentService,
	drService,
	scheduleAppointmentService,
} from '../mongoServices';
import { monthlyTimeSlotModel, scheduleAppointmentModel } from '../models';
import { Types } from 'mongoose';
import moment from 'moment';
require('dotenv').config({ path: 'src/config/.env' });

const scheduleAppointment = async (appointment) => {
	try {
		if (appointment.isSchedule === false) {
			let drFilter = {
				timeSlot: appointment.timeSlotId,
				pagination: false,
			};
			let { data: dr } = await drService.findAllQuery(drFilter);

			console.log('dr.length !== 0', dr.length !== 0);
			if (dr.length !== 0) {
				let availableDr = [];
				for (const element of dr) {
					let filter = {
						timeSlotId: appointment.timeSlotId,
						drId: element._id,
						date: appointment.date,
					};
					let { data: checkSlot } =
						await scheduleAppointmentService.findAllQuery(filter);

					if (checkSlot.length === 0) {
						availableDr = element;
						break;
					}
				}

				if (availableDr.length !== 0) {
					let drAppointment = {
						drId: availableDr._id,
						appointmentId: appointment.id,
						patientId: appointment.patientId,
						date: appointment.date,
						timeSlotId: appointment.timeSlotId,
					};
					let scheduleAppointmentPayload = new scheduleAppointmentModel(
						drAppointment,
					);
					let data = await scheduleAppointmentPayload.save();
					let filterA = { _id: Types.ObjectId(appointment._id) };
					let updateAppointment = {
						isSchedule: true,
						drId: availableDr._id,
						scheduleAppointmentID: data._id,
					};
					await appointmentService.updateOneQuery(filterA, updateAppointment);
					return availableDr;
				} else {
					return {
						error: 'slot is not a available',
					};
				}
			} else {
				return {
					error: 'dr is not available',
				};
			}
			// let startDate = moment(appointment.date).startOf('day').toISOString();
			// let endDate = moment(appointment.date).endOf('day').toISOString();
		} else {
			throw new Error('Appointment already scheduled');
		}
	} catch (error) {
		console.log('error', error);
		// errorLogger(error.message, req.originalUrl, req.ip);
		return {
			error: error.message || FAILED_RESPONSE,
		};
	}
};
const getScheduleAppointment = async (_req, res) => {
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

export default { scheduleAppointment, getScheduleAppointment };
