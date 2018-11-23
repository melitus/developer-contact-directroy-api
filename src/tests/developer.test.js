const chai = require('chai');
const request = require('supertest');
const httpStatus = require('http-status');

const app = require('../server/index');

const expect = chai.expect;

describe('Developer Contact Diretory Api Test', () => {
  const developer = {
    email: 'asmelitus@gmail.com',
    username: 'santino',
    password:'santino',
    createdAt: '',
    category: ['frontend'],
    default: ['developer']
  };

  describe('# Get all developers', () => {
    it('should get all developers', (done) => {
      request(app)
        .get('/developers')
        .set('Accept', 'application/json')
        .expect(httpStatus.OK)
        .end((res) => {
          expect(res.body).to.be.an('array');
          expect(res.body).to.be.empty; 
        done();
        });
    });
  });

  describe('# Create Developer Contact Directory ', () => {
    it('should create a developer model', (done) => {
      request(app)
        .post('/developers')
        .set('Accept', 'application/json')
        .send(developer)
        .expect(httpStatus.CREATED)
        .end((res) => {
          expect(res.body.name).to.equal('test');
          developer = res.body;
         done();
        });
    });
  });
  describe('# Get a developer by id', () => {
    it('should get a developer', (done) => {
      request(app)
        .get('/developers/' + "developerId")
        .set('Accept', 'application/json')
        .expect(httpStatus.OK)
        .end(( res) => {
          expect(res.body.name).to.equal('test');
        done();
        });
    });
  });

  describe('# Update a developer by id', () => {
    it('should modify a developer', (done) => {
      developer.name = 'New Developer'
      request(app)
        .put('/developers/' + "developerId")
        .set('Accept', 'application/json')
        .send(developer)
        .expect(httpStatus.OK)
        .end((res) => {
          expect(res.body.name).to.equal('New Developer');
          done();
        });
    });
  });
  describe('# Delete a developer by id', () => {
    it('should delete a developer', (done) => {
      request(app)
        .delete('/developers/' + "developerId")
        .set('Accept', 'application/json')
        .expect(httpStatus.OK)
        .end(( res) => {
          expect(res.body.message).to.equal('Developer successfully deleted');
          done();
        });
    });
  });
});
