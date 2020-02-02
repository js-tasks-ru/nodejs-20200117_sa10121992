const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.limit = options.limit;
    this.contentSize = 0;
  }

  _transform(chunk, encoding, callback) {
    this.contentSize += Buffer.byteLength(chunk, encoding);

    this.contentSize > this.limit
        ? callback(new LimitExceededError(), null)
        : callback(null, chunk);
  }
}

module.exports = LimitSizeStream;
