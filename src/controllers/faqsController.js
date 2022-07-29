import { faqsModel } from '../models';
import { CONSTANTS } from '../constants';
import { errorLogger } from '../utils';
import { faqService } from '../mongoServices';
const {
	RESPONSE_MESSAGE: { FAILED_RESPONSE, FAQS },
	STATUS_CODE: { SUCCESS, FAILED },
} = CONSTANTS;
const addFaq = async (req, res) => {
	try {
		const { body } = req;
		const payload = new faqsModel(body);
		const data = await payload.save();
		if (data) {
			res.status(SUCCESS).json({
				status: true,
				msg: FAQS.ADD_SUCCESS,
				data,
			});
		} else {
			throw new Error(FAQS.DELETE_FAILED);
		}
	} catch (error) {
		errorLogger(error);
		res.status(FAILED).json({
			status: false,
			error: error.message || FAILED_RESPONSE,
		});
	}
};

const getFAQS = async (req, res) => {
	try {
		const { data, totalCount } = await faqService.findAllQuery(req.query);
		if (data) {
			res.status(SUCCESS).json({
				status: true,
				msg: FAQS.GET_SUCCESS,
				data,
				totalCount,
			});
		} else {
			throw new Error(FAQS.GET_FAILED);
		}
	} catch (error) {
		errorLogger(error);
		res.status(FAILED).json({
			status: false,
			error: error.message || FAILED_RESPONSE,
		});
	}
};
const deleteFAQS = async (req, res) => {
	try {
		const filter = { _id: req.params.id };
		const update = {
			isDeleted: true,
			deletedBy: req.currentUser._id,
			deletedAt: Date.now(),
			isEnabled: false,
		};
		const projection = {};
		const deletePackageResponse = await faqService.updateOneQuery(
			filter,
			update,
			projection,
		);
		if (deletePackageResponse) {
			res.status(SUCCESS).json({
				status: true,
				msg: FAQS.DELETE_SUCCESS,
				data: [],
			});
		} else {
			throw new Error(FAQS.DELETE_FAILED);
		}
	} catch (err) {
		errorLogger(err);
		res.status(FAILED).json({
			status: false,
			error: err.message || FAILED_RESPONSE,
		});
	}
};

const updateFAQS = async (req, res) => {
	try {
		const filter = { _id: req.params.id };
		const updateObj = {
			...req.body,
		};
		const projection = {};
		const updatePackageResponse = await faqService.updateOneQuery(
			filter,
			updateObj,
			projection,
		);
		if (updatePackageResponse) {
			res.status(SUCCESS).json({
				status: true,
				msg: FAQS.UPDATE_SUCCESS,
				data: [],
			});
		} else {
			throw new Error(FAQS.UPDATE_FAILED);
		}
	} catch (err) {
		errorLogger(err);
		res.status(FAILED).json({
			status: false,
			error: err.message || FAILED_RESPONSE,
		});
	}
};

export default {
	addFaq,
	getFAQS,
	deleteFAQS,
	updateFAQS,
};
