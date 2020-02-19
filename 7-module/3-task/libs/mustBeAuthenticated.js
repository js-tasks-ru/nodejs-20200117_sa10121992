const Session = require('../models/Session');
const User = require('../models/User');

module.exports = async function mustBeAuthenticated(ctx, next) {
  const authorization = ctx.headers && ctx.headers.authorization;
  const token = authorization && authorization.split(' ').slice(1).join(' ');

  if ( ! token) {
    return ctx.throw(401, 'Пользователь не залогинен');
  }

  const session = await Session.findOne({token});

  if ( ! session) {
    return ctx.throw(401, 'Неверный аутентификационный токен');
  }

  const user = await User.findOne(session.user);

  ctx.user = {
    email: user.email,
    displayName: user.displayName,
  };

  await Session.findOneAndUpdate({token}, {lastVisit: new Date});

  return next();
};
