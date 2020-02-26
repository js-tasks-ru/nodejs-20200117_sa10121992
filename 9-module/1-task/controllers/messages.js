const Message = require('../models/Message');
const mapMessage = require('../mappers/message');

module.exports.messageList = async function messages(ctx, next) {
  const messageList = await Message.find({user: ctx.user.displayName});

  ctx.body = {messages: messageList.map(mapMessage)};
};
