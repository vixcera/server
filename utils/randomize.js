const randomize = () => {
  const random = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
  let orderId = '';
  for (let i = 0; i < 10; i++) {
    orderId += random.charAt(Math.floor(Math.random() * random.length));
  }
  return orderId;
};

export default randomize;
