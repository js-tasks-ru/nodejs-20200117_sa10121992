const Category = require('../models/Category');

module.exports.categoryList = async function categoryList(ctx, next) {
  const list = await Category.find();

  ctx.body = {categories: list.map((category) => mapCategory(category))};
};

function mapCategory(category) {
  const obj = {
    id: category._id,
    title: category.title,
  };

  if (category.subcategories) {
    obj.subcategories = category.subcategories.map((subcategory) => mapCategory(subcategory));
  }

  return obj;
}
