const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')('public'));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

let subscribers = [];

const addSubscriber = (subscriber) => subscribers.push(subscriber);
const removeSubscriber = (subscriber) => subscribers = subscribers.filter((x) => x !== subscriber);

router.get('/subscribe', async (ctx, next) => {
  next();

  await keep(ctx);
});

function keep(ctx) {
  return new Promise((resolve, reject) => {
    addSubscriber(ctx);
    ctx.req.on('aborted', () => removeSubscriber(ctx));
  });
}

router.post('/publish', async (ctx, next) => {
  const {message} = ctx.request.body;

  if (message) {
    subscribers.forEach((subscriber) => {
      subscriber.body = message;
      subscriber.res.end(message);
      removeSubscriber(subscriber);
    });
  }

  ctx.body = 'OK';

  return next();
});

app.use(router.routes());

module.exports = app;
