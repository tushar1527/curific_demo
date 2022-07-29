import {
	healthService,
	packagesService,
	specialityService,
	faqService,
} from '../mongoServices';
import { CONSTANTS } from '../constants';
import { errorLogger } from '../utils';

const {
	RESPONSE_MESSAGE: { FAILED_RESPONSE, DASHBOARD },
	STATUS_CODE: { SUCCESS, FAILED },
} = CONSTANTS;
const getDashboard = async (req, res) => {
	try {
		const { data: healthArticle } = await healthService.findAllQuery(req.query);
		const { data: packages } = await packagesService.findAllQuery(req.query);
		const { data: pain } = await specialityService.findAllQuery(req.query);
		const { data: faq } = await faqService.findAllQuery(req.query);

		return res.status(SUCCESS).send({
			success: true,
			msg: DASHBOARD.GET_SUCCESS,
			data: {
				healthArticle,
				packages,
				pain,
				faq,
			},
		});
	} catch (error) {
		errorLogger(error.message, req.originalUrl, req.ip);
		return res.status(FAILED).send({
			msg: error.message || FAILED_RESPONSE,
			success: false,
		});
	}
};

export default { getDashboard };
