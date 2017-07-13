const DATABASE_URL = process.env.DATABASE_URL ||
                     global.DATABASE_URL ||
                     'mongodb://a:a@ds153392.mlab.com:53392/mini-blog-app';
const PORT = process.env.PORT || 8080;
const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ||
                          global.DATABASE_URL ||
                          'mongodb://a:a@ds157282.mlab.com:57282/mini-blog-app-test';
module.exports = {
  DATABASE_URL,
  TEST_DATABASE_URL,
  PORT
};
