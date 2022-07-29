import moment from 'moment';
import { monthlyTimeSlotModel } from '../models';

const getDailyTimeSlot = async (query) => {
	let { date } = query,
		whereClues = {};

	if (date) {
		whereClues = {
			...whereClues,
			date: {
				$gte: moment(date)
					.utc(false)
					.add(1, 'days')
					.startOf('day')
					.toISOString(),
				$lte: moment(date).utc(false).add(1, 'days').endOf('day').toISOString(),
			},
		};
	}

	let data = await monthlyTimeSlotModel.aggregate([
		{
			$match: whereClues,
		},
		{
			$lookup: {
				from: 'timeslotalls',
				localField: 'timeSlotId',
				foreignField: '_id',
				as: 'timeSlot',
			},
		},
	]);
	return { data };
};

export default {
	getDailyTimeSlot,
};
