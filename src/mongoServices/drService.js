import { drModel } from '../models';
const findAllQuery = async (query) => {
	let {
		search,
		_id,
		limit,
		page,
		sortField,
		sortValue,
		email,
		timeSlot,
		pagination,
	} = query;
	console.log('limit', query);
	let sort = {};
	let whereClause = {};
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
			$or: [{ email: search }, { name: search }, { mobileNumber: search }],
		};
	}
	if (_id) {
		whereClause = { ...whereClause, _id };
	}
	if (email) {
		whereClause = { ...whereClause, email };
	}
	if (timeSlot) {
		whereClause = { ...whereClause, timeSlot };
	}
	if (pagination) {
		const data = await drModel.find(whereClause).sort(sort);
		return data;
	} else {
		const data = await drModel
			.find(whereClause)
			.skip(page > 0 ? +limit * (+page - 1) : 0)
			.limit(+limit || 20)
			.sort(sort);

		const totalCount = await drModel.find(whereClause).countDocuments();
		return { data, totalCount };
	}
};

const updateOneQuery = async (filter, update, projection) => {
	let options = { new: true, fields: { ...projection } };

	const data = await drModel.findOneAndUpdate(filter, update, options);
	return data;
};

export default {
	findAllQuery,
	updateOneQuery,
};
