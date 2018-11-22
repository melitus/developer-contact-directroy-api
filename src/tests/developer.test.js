const chai = require('chai');
const request = require('supertest');

const app = require('../server/index');


const expect = chai.expect;

describe('Developer Contact Diretory Api Test', function() {
  const developer = {
    name: 'integration test',
  };

  describe('# Create Developer Contact Directory ', function() {
    it('should create a developer model', function(done) {
      request(app)
        .post('/developers')
        .send(developer)
        .set('Accept', 'application/json')
        .end(function(err, res) {
          expect(res.statusCode).to.equal(200);
          expect(res.body.name).to.equal('integration test');
          task = res.body;
          done();
        });
    });
  });

  describe('# Get all developers', function() {
    it('should get all developers', function(done) {
      request(app)
        .get('/developers')
        .set('Accept', 'application/json')
        .end(function(err, res) {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an('array');
          done();
        });
    });
  });
  describe('Get a developer by id', function() {
    it('should get a task', function(done) {
      request(app)
        .get('/developers/' + developer._id)
        .set('Accept', 'application/json')
        .end(function(err, res) {
          expect(res.statusCode).to.equal(200);
          expect(res.body.name).to.equal('integration test');
          done();
        });
    });
  });

  describe('Update a developer by id', function() {
    it('should modify a developer', function(done) {
      developer.name = 'New Developer'
      request(app)
        .put('/developers/' + developer._id)
        .send(developer)
        .set('Accept', 'application/json')
        .end(function(err, res) {
          expect(res.body.name).to.equal('New Developer');
          expect(res.statusCode).to.equal(200);
          done();
        });
    });
  });
  describe('Delete a developer by id', function() {
    it('should delete a developer', function(done) {
      request(app)
        .delete('/developers/' + developer._id)
        .set('Accept', 'application/json')
        .end(function(err, res) {
          expect(res.statusCode).to.equal(200);
          expect(res.body.message).to.equal('Developer successfully deleted');
          done();
        });
    });
  });
});
