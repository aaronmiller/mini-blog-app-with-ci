const DATABASE_URL = process.env.DATABASE_URL ||
                     global.DATABASE_URL ||
                     'mongodb://localhost/mini-blog-app';
const PORT = process.env.PORT || 1337;
const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ||
                          global.DATABASE_URL ||
                          'mongodb://localhost/test-database';
module.exports = {
  DATABASE_URL,
  TEST_DATABASE_URL,
  PORT
};
