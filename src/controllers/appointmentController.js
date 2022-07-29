import { appointmentModel } from '../models';
import { CONSTANTS } from '../constants';
import { errorLogger } from '../utils';
import { appointmentService } from '../mongoServices';
import moment from 'moment';
import { scheduleAppointmentController } from './';

const {
	RESPONSE_MESSAGE: { FAILED_RESPONSE, APPOINTMENT },
	STATUS_CODE: { SUCCESS, FAILED },
} = CONSTANTS;
const createAppointment = async (req, res) => {
	try {
		const { currentUser } = req;
		const { date, timeSlotId } = req.body;
		let payload = {
			date: {
				$gte: moment(date).add(1, 'days').utc().startOf('day').toISOString(),
				$lte: moment(date).add(1, 'days').utc().endOf('day').toISOString(),
			},
			timeSlotId,
			patientId: currentUser._id,
		};

		const appointment = await appointmentService.findAllQuery(payload);
		if (appointment?.data?.length === 0) {
			let updateDate = new Date(date).setHours(8);
			let payloadData = {
				date: updateDate,
				patientId: currentUser._id,
				timeSlotId, 
			};
			const payloadSave = new appointmentModel(payloadData);
			const savePayload = await payloadSave.save();
			if (savePayload) {
				const scheduleAppointment =
					await scheduleAppointmentController.scheduleAppointment(savePayload);
				return res.status(SUCCESS).send({
					success: true,
					msg: APPOINTMENT.CREATE_SUCCESS,
					data: scheduleAppointment,
				});
			} else {
				throw new Error(APPOINTMENT.CREATE_FAILED);
			}
		} else {
			const scheduleAppointment =
				await scheduleAppointmentController.scheduleAppointment(
					appointment.data[0],
				);
			if (scheduleAppointment?.error) {
				throw new Error(scheduleAppointment.error);
			} else {
				return res.status(SUCCESS).send({
					success: true,
					msg: APPOINTMENT.CREATE_SUCCESS,
					data: scheduleAppointment,
				});
			}
		}
	} catch (err) {
		errorLogger(err.message, req.originalUrl, req.ip);
		return res.status(FAILED).send({
			error: err.message || FAILED_RESPONSE,
			success: false,
		});
	}
};
const getAppointment = async (req, res) => {
	try {
		let filter = {
			...req.query,
			populate: true,
		};
		let { data, totalCount } = await appointmentService.findAllQuery(filter);
		if (data) {
			return res.status(SUCCESS).json({
				success: true,
				message: APPOINTMENT.GET_SUCCESS,
				data,
				totalCount,
			});
		} else {
			throw new Error(HEALTH_ARTICLE.GET_FAILED);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);

		return res.status(FAILED).json({
			success: false,
			error: error.message || FAILED_RESPONSE,
		});
	}
};
const updateAppointment = async (req, res) => {
	try {
		const filter = { _id: req.params.id };
		const update = {
			...req.body,
		};
		const projection = {};
		const AppointmentUpdate = await appointmentService.updateOneQuery(
			filter,
			update,
			projection,
		);
		if (AppointmentUpdate) {
			return res.status(SUCCESS).send({
				success: true,
				message: APPOINTMENT.UPDATE_SUCCESS,
				data: [],
			});
		} else {
			throw new Error(APPOINTMENT.UPDATE_FAILED);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		return res.status(FAILED).send({
			success: false,
			message: APPOINTMENT.UPDATE_FAILED,
			data: [],
		});
	}
};
const deleteAppointment = async (req, res) => {
	try {
		const { id } = req.params;
		let filter = { _id: id },
			updateData = {
				isEnabledL: false,
				deletedAt: new Date(),
				deletedBy: req.currentUser._id,
			};
		const deleteAPP = await appointmentService.updateOneQuery(
			filter,
			updateData,
		);

		if (deleteAPP) {
			return res.status(SUCCESS).send({
				success: true,
				msg: APPOINTMENT.DELETE_SUCCESS,
				data: [],
			});
		} else {
			throw new Error(APPOINTMENT.DELETE_FAILED);
		}
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		return res.status(FAILED).json({
			success: false,
			error: error.message || FAILED_RESPONSE,
		});
	}
};

export default {
	createAppointment,
	getAppointment,
	updateAppointment,
	deleteAppointment,
};
