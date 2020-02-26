const socketIO = require('socket.io');

const Session = require('./models/Session');
const Message = require('./models/Message');

function socket(server) {
  const io = socketIO(server);

  io.use(async function(socket, next) {
    const token = socket.handshake.query.token;
    const session = await Session.findOne({token}).populate('user');

    if (session) {
      socket.user = session.user;

      next();
    } else {
      next(new Error('anonymous sessions are not allowed'));
    }
  });

  io.on('connection', function(socket) {
    socket.on('message', async (msg) => {
      await Message.create({
        user: socket.user.displayName,
        text: msg,
        date: new Date,
        chat: socket.user.id,
      });
    });
  });

  return io;
}

module.exports = socket;
