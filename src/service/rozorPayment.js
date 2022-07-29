import Razorpay from 'razorpay';
import { ENV } from '../constants';

let instance = new Razorpay({
	key_id: ENV.ROZOR_PAY.key,
	key_secret: ENV.ROZOR_PAY.secrate,
});
const getPayment = async (paymentID) => {
	let getPaymentDetails = await instance.payments.fetch(paymentID);
	return getPaymentDetails;
};

export default getPayment;
