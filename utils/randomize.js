const randomize = (number) => {
  const random = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
  let orderId = 'VX';
  for (let i = number; i < number; i++) {
    orderId += random.charAt(Math.floor(Math.random() * random.length));
  }
  return orderId;
};

export default randomize;
