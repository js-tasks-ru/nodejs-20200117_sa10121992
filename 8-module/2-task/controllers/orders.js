const Product = require('../models/Product');
const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');

module.exports.checkout = async function checkout(ctx, next) {
  const {product: productId, address, phone} = ctx.request.body;
  const product = await Product.findById(productId);

  // if ( ! product || ! address || ! phone) {
  //   throw new Error({name: 'ValidationError'});
  // }

  const order = await Order.create({
    user: ctx.user.id,
    product: productId,
    address,
    phone,
  });

  await sendMail({
    template: 'order-confirmation',
    locals: {id: order.id, product},
    to: ctx.user.email,
    subject: 'Ваш заказ',
  });

  ctx.body = {
    order: order.id,
  };
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const orderList = await Order.find({user: ctx.user.id});

  ctx.body = {
    orders: orderList,
  };
};
