const chai = require('chai');
const request = require('supertest');
const httpStatus = require('http-status');


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
        .set('Accept', 'application/json')
        .send(developer)
        .expect(httpStatus.CREATED)
        .then((res) => {
          expect(res.body.name).to.equal('integration test');
          developer = res.body;
          done();
        });
    });
  });

  describe('# Get all developers', function() {
    it('should get all developers', function(done) {
      request(app)
        .get('/developers')
        .set('Accept', 'application/json')
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array');
          done();
        });
    });
  });
  describe('Get a developer by id', function() {
    it('should get a developer', function(done) {
      request(app)
        .get('/developers/' + developerId)
        .set('Accept', 'application/json')
        .expect(httpStatus.OK)
        .then(( res) => {
          expect(res.body.name).to.equal('integration test');
          done();
        });
    });
  });

  describe('Update a developer by id', function() {
    it('should modify a developer', function(done) {
      developer.name = 'New Developer'
      request(app)
        .put('/developers/' + developerId)
        .set('Accept', 'application/json')
        .send(developer)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.name).to.equal('New Developer');
          done();
        });
    });
  });
  describe('Delete a developer by id', function() {
    it('should delete a developer', function(done) {
      request(app)
        .delete('/developers/' + developerId)
        .set('Accept', 'application/json')
        .expect(httpStatus.OK)
        .then(( res) => {
          expect(res.body.message).to.equal('Developer successfully deleted');
          done();
        });
    });
  });
});
