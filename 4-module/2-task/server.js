const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      fs.stat(filepath, (err) => {
        if ( ! err) {
          res.statusCode = 409;
          res.end();

          return;
        }

        if (/\//.test(pathname)) {
          res.statusCode = 400;
          res.end();

          return;
        }

        const limitedStream = new LimitSizeStream({limit: 1024 * 1024});
        const file = fs.createWriteStream(filepath, {flags: 'wx'});

        req
            .pipe(limitedStream)
            .on('error', () => {
              file.destroy();

              fs.unlink(filepath, () => {});

              res.statusCode = 413;
              res.end('File limit exceeded');
            })
            .pipe(file)
            .on('close', () => {
              res.statusCode = 201;
              res.end();
            });

        req.on('aborted', () => fs.unlink(filepath, (err) => err && console.log(err)));
      });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
