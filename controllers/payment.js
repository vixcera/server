import midtrans from 'midtrans-client';
import randomize from '../utils/randomize.js';
import { products } from '../models/models.js';
import { validatephone } from "../utils/validate.js"

const placeOrder = async (request, response) => {

  const { vid, name, email, phone } = request.body;
  if (!name || !email || !phone) return response.status(403).json('please complete the data!');
  if (!email.includes('@gmail.com')) return response.status(403).json('please input a valid email!');
  if (!validatephone(phone)) return response.status(403).json("please input a valid number")

  const product = await products.findOne({ where: { vid } });
  if (!product) return response.status(404).json('product not found!');
  const orderId = randomize(5)
  const productPrice = parseFloat(product.price);
  const ppn = productPrice * 0.11;
  const total = productPrice + ppn;


  const snap = new midtrans.Snap({
    isProduction: true,
    serverKey: `${process.env.serverKey}`,
  });

  const parameter = {
    transaction_details: {
      order_id: `${orderId}`,
      gross_amount: total,
    },
    credit_card: {
      secure: true,
    },
    item_details: {
      id: `${product.vid}`,
      name: `${product.title}`,
      price: `${total}`,
      quantity: '1',
    },
    customer_details: {
      first_name: name,
      last_name: '',
      email,
      phone,
    },
  };

  snap.createTransaction(parameter)
    .then((transaction) => {
      const transactionToken = transaction.token;
      response.status(200).json(transactionToken);
      console.log('transactionToken:', transactionToken);
    })
    .catch((error) => console.log(error.message))
};

export default placeOrder;