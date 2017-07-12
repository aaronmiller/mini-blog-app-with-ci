const mongoose = require('mongoose');
const faker = require('faker');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { BlogPost } = require('../models');
const {
  TEST_DATABASE_URL
} = require('../config');
const {
  app,
  runServer,
  closeServer
} = require('../index');

const should = chai.should();

chai.use(chaiHttp);

function tearDownDb() {
  return new Promise((resolve, reject) => {
    console.warn('Deleting database...');
    mongoose.connection.dropDatabase()
    .then(result => resolve(result))
    .catch(err => reject(err));
  });
}

function seedTestData() {
  console.info('Seeding test data...');
  const testData = [];
  for (let i = 0; i < 10; i += 1) {
    testData.push({
      author: {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName()
      },

      title: faker.lorem.sentence(),
      content: faker.lorem.text()
    });
  }

  return BlogPost.insertMany(testData);
}

describe('Blog App API with MongoDB', function() {
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return seedTestData();
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  });

  describe('Get all posts.', function() {
    it('should get all blog posts from /posts route.', function() {
      return chai.request(app)
        .get('/posts')
        .then(function(res) {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.at.least(1);
        });
    });
  });

  describe('Add a new post.', function() {
    it('should add a new post from the /posts route.', function() {
      // Required parameters for the post.
      const newPost = {
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraph(),
        author: {
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName()
        }
      };

      return chai.request(app)
        .post('/posts')
        .send(newPost)
        .then(function(res) {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.title.should.equal(newPost.title);
          res.body.author.should.equal(`${newPost.author.firstName} ${newPost.author.lastName}`);
          res.body.content.should.equal(newPost.content);
        });
    });
  });

  describe('Amend an existing post.', function() {
    it('should modify an existing post', function() {
      const changedPost = {
        title: faker.lorem.sentence(),
        author: {
          firstName: faker.name.firstName()
        },
        content: faker.lorem.paragraph()
      };

      return chai.request(app)
        .get('/posts')
        .then(function(res) {
          console.log(res.body[0].id);
          return chai.request(app)
          .post(`/posts/${res.body[0].id}`)
          .send(changedPost)
          .then(function() {
            console.log(res.body);
          });
        });
    });
  });
});
