import { CONSTANTS } from '../constants';
import { appointmentService } from '../mongoServices';
import { rozorPayment } from '../service';
const {
	RESPONSE_MESSAGE: { FAILED_RESPONSE, FAQS },
	STATUS_CODE: { SUCCESS, FAILED },
} = CONSTANTS;

const addPayment = async (req, res) => {
	try {
		const { body } = req;
		const { data: appointment } = await appointmentService.findAllQuery({
			_id: body.appointmentId,
		});
		if (appointment.length !== 0) {
			const paymentDetails = await rozorPayment(body.paymentId);
		}
		return res.status(SUCCESS).json({
			status: true,
			msg: FAQS.ADD_SUCCESS,
			data: appointment,
		});
	} catch (error) {
		res.status(FAILED).json({
			status: false,
			error: error.message || FAILED_RESPONSE,
		});
	}
};

export default { addPayment };
