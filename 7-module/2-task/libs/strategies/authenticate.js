const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  if ( ! email) {
    return done(null, false, 'Не указан email');
  }

  const user = await User.findOne({email});

  if (user) {
    done(null, user);
  } else {
    User.create({email, displayName}, (err, res) => {
      if (err) {
        done(err, false, 'Невалидный email');
      } else {
        done(null, res);
      }
    });
  }
};
