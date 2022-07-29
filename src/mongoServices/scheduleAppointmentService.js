import { scheduleAppointmentModel } from '../models';
const findAllQuery = async (query) => {
	let {
		search,
		_id,
		limit,
		page,
		sortField,
		sortValue,
		date,
		timeSlotId,
		drId,
	} = query;
	let sort = {};
	let whereClause = { isDeleted: false };

	if (sortField) {
		sort = {
			[sortField]: sortValue === 'ASC' ? 1 : -1,
		};
	} else {
		sort = {
			displayName: 1,
		};
	}
	if (search) {
		search = new RegExp(search, 'ig');
		whereClause = {
			$or: [{ displayName: search }, { path: search }],
		};
	}
	if (_id) {
		whereClause = { ...whereClause, _id };
	}
	if (date) {
		whereClause = { ...whereClause, date };
	}
	if (timeSlotId) {
		whereClause = { ...whereClause, timeSlotId };
	}
	if (drId) {
		whereClause = { ...whereClause, drId };
	}
	console.log('whereClause', whereClause);
	const data = await scheduleAppointmentModel
		.find(whereClause)
		.skip(page > 0 ? +limit * (+page - 1) : 0)
		.limit(+limit || 20)
		.sort(sort);
	const totalCount = await scheduleAppointmentModel
		.find(whereClause)
		.countDocuments();
	return { data, totalCount };
};

const updateOneQuery = async (filter, update, projection) => {
	let options = { new: true, fields: { ...projection } };

	const data = await scheduleAppointmentModel.findOneAndUpdate(
		filter,
		update,
		options,
	);
	return data;
};

export default {
	findAllQuery,
	updateOneQuery,
};
