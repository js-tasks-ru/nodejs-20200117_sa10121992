const Product = require('../models/Product');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  if ( ! ctx.query.subcategory) {
    return next();
  }

  const products = await Product.find({subcategory: ctx.query.subcategory});

  ctx.body = {products: products.map((product) => mapProduct(product))};
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find();

  ctx.body = {products: products.map((product) => mapProduct(product))};
};

module.exports.productById = async function productById(ctx, next) {
  let product;

  try {
    product = await Product.findById(ctx.params.id);
  } catch (e) {
    ctx.status = 400;

    ctx.throw(400);
  }

  if ( ! product) {
    ctx.throw(404);
  }

  ctx.body = {product: mapProduct(product)};
};

function mapProduct(product) {
  return {
    id: product.id,
    title: product.title,
    category: product.category,
    subcategory: product.subcategory,
    description: product.description,
    price: product.price,
    images: product.images,
  };
}
