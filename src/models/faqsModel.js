import { Schema, model, Types } from 'mongoose';
const faqsSchema = new Schema(
	{
		question: {
			type: String,
		},
		answer: {
			type: String,
		},

		isEnabled: {
			type: Boolean,
			required: true,
			default: true,
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
module.exports = new model('Faqs', faqsSchema);
