'use strict';

var app = require('../..');
import request from 'supertest';

var newRoommate;

describe('Roommate API:', function() {

  describe('GET /api/roommates', function() {
    var roommates;

    beforeEach(function(done) {
      request(app)
        .get('/api/roommates')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          roommates = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      roommates.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/roommates', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/roommates')
        .send({
          name: 'New Roommate',
          info: 'This is the brand new roommate!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newRoommate = res.body;
          done();
        });
    });

    it('should respond with the newly created roommate', function() {
      newRoommate.name.should.equal('New Roommate');
      newRoommate.info.should.equal('This is the brand new roommate!!!');
    });

  });

  describe('GET /api/roommates/:id', function() {
    var roommate;

    beforeEach(function(done) {
      request(app)
        .get('/api/roommates/' + newRoommate._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          roommate = res.body;
          done();
        });
    });

    afterEach(function() {
      roommate = {};
    });

    it('should respond with the requested roommate', function() {
      roommate.name.should.equal('New Roommate');
      roommate.info.should.equal('This is the brand new roommate!!!');
    });

  });

  describe('PUT /api/roommates/:id', function() {
    var updatedRoommate;

    beforeEach(function(done) {
      request(app)
        .put('/api/roommates/' + newRoommate._id)
        .send({
          name: 'Updated Roommate',
          info: 'This is the updated roommate!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedRoommate = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedRoommate = {};
    });

    it('should respond with the updated roommate', function() {
      updatedRoommate.name.should.equal('Updated Roommate');
      updatedRoommate.info.should.equal('This is the updated roommate!!!');
    });

  });

  describe('DELETE /api/roommates/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/roommates/' + newRoommate._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when roommate does not exist', function(done) {
      request(app)
        .delete('/api/roommates/' + newRoommate._id)
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});
