const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
    {session: false, usernameField: 'email'},
    function(email, password, done) {
      User.findOne({email: email}, async (err, user) => {
        if (err) {
          return done(err);
        }

        if ( ! user) {
          return done(null, false, 'Нет такого пользователя');
        }

        const isCorrectPassword = await user.checkPassword(password);

        if (isCorrectPassword) {
          return done(null, user);
        } else {
          return done(null, false, 'Неверный пароль');
        }
      });
    }
);
