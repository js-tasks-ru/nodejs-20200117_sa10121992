const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.lastString = '';
  }

  _transform(chunk, encoding, callback) {
    const strings = (this.lastString + chunk.toString()).split(os.EOL);

    strings.slice(0, -1).forEach((str) => {
      this.push(Buffer.from(str));
    });

    this.lastString = strings[strings.length - 1];

    callback();
  }

  _flush(callback) {
    this.push(Buffer.from(this.lastString));

    callback();
  }
}

module.exports = LineSplitStream;
