import { Schema, model, Types } from 'mongoose';

const scheduleAppointment = new Schema(
	{
		appointmentId: {
			type: Types.ObjectId,
			ref: 'appointment',
		},
		drId: {
			type: Types.ObjectId,
			ref: 'dr_details',
		},
		patientId: {
			type: Types.ObjectId,
			ref: 'customer_details',
		},
		timeSlot: {
			startTime: {
				type: String,
			},
			endTime: {
				type: String,
			},
		},
		timeSlotId: {
			type: Types.ObjectId,
			ref: 'timeSlotALL',
		},
		date: {
			type: Date,
		},

		deletedAt: {
			type: Date,
			default: null,
		},
		isDeleted: {
			type: Boolean,
			default: false,
		},
		deletedBy: {
			type: Types.ObjectId,
			default: null,
		},
	},
	{ timestamps: true },
);
let autoPopulateLead = function (next) {
	this.populate('appointmentId');
	this.populate('drId');
	this.populate('patientId');

	next();
};

scheduleAppointment
	.pre('findOne', autoPopulateLead)
	.pre('find', autoPopulateLead);
module.exports = new model('scheduleAppointment', scheduleAppointment);
