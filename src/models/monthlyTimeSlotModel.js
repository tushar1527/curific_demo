import { Schema, model, Types } from 'mongoose';

const languageModel = new Schema(
	{
		timeSlotId: {
			type: Types.ObjectId,
			ref: 'timeSlotALL',
		},
		date: {
			type: String,
			trim: true,
			max: 255,
			required: true,
		},
		deletedAt: {
			type: Date,
			default: null,
		},
		deletedBy: {
			type: Types.ObjectId,
			default: null,
		},
	},
	{ timestamps: true },
);

module.exports = new model('monthlyTimeSlot', languageModel);
