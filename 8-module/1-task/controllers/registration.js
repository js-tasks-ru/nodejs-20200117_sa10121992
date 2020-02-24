const uuid = require('uuid/v4');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  const email = ctx.request.body.email;
  const displayName = ctx.request.body.displayName;
  const password = ctx.request.body.password;
  const token = uuid();

  try {
    const user = await User.create({
      verificationToken: uuid(),
      email,
      displayName,
    });

    await user.setPassword(password);
    await user.save();
  } catch (e) {
    ctx.status = 400;
    ctx.body = {
      errors: {
        email: 'Такой email уже существует',
      },
    };

    return;
  }

  await sendMail({
    to: email,
    template: 'confirmation',
    locals: {token},
    subject: 'Confirmation',
  });

  ctx.body = {status: 'ok'};
};


module.exports.confirm = async (ctx, next) => {
  const {verificationToken} = ctx.request.body;

  try {
    const user = await User.findOneAndUpdate(
        {verificationToken},
        {$unset: {verificationToken}},
    );

    const token = await ctx.login(user);

    ctx.body = {token};
  } catch (e) {
    ctx.throw(400, 'Ссылка подтверждения недействительна или устарела');
  }
};
