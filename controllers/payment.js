import midtrans from 'midtrans-client';
import randomize from '../utils/randomize.js';
import { products } from '../models/models.js';

const placeOrder = async (request, response) => {

  const {
    id, name, email, phone,
  } = request.body;
  if (!name || !email || !phone) return response.status(403).json('please complete the data!');
  if (!email.includes('@gmail.com')) return response.status(403).json('please input a valid email!');

  const product = await products.findOne({ where: { id } });
  if (!product) return response.status(404).json('product not found!');
  const orderId = randomize(5)

  const snap = new midtrans.Snap({
    isProduction: true,
    serverKey: `${process.env.serverKey}`,
  });

  const parameter = {
    transaction_details: {
      order_id: `${orderId}`,
      gross_amount: product.price,
    },
    credit_card: {
      secure: true,
    },
    item_details: {
      id: `${product.id}`,
      name: `${product.title}`,
      price: `${product.price}`,
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
    });
};

export default placeOrder;