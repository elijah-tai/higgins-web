'use strict';

var app = require('../..');
import request from 'supertest';

var newRoomMate;

describe('RoomMate API:', function() {

  describe('GET /api/roomMates', function() {
    var roomMates;

    beforeEach(function(done) {
      request(app)
        .get('/api/roomMates')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          roomMates = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      roomMates.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/roomMates', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/roomMates')
        .send({
          name: 'New RoomMate',
          info: 'This is the brand new roomMate!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newRoomMate = res.body;
          done();
        });
    });

    it('should respond with the newly created roomMate', function() {
      newRoomMate.name.should.equal('New RoomMate');
      newRoomMate.info.should.equal('This is the brand new roomMate!!!');
    });

  });

  describe('GET /api/roomMates/:id', function() {
    var roomMate;

    beforeEach(function(done) {
      request(app)
        .get('/api/roomMates/' + newRoomMate._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          roomMate = res.body;
          done();
        });
    });

    afterEach(function() {
      roomMate = {};
    });

    it('should respond with the requested roomMate', function() {
      roomMate.name.should.equal('New RoomMate');
      roomMate.info.should.equal('This is the brand new roomMate!!!');
    });

  });

  describe('PUT /api/roomMates/:id', function() {
    var updatedRoomMate;

    beforeEach(function(done) {
      request(app)
        .put('/api/roomMates/' + newRoomMate._id)
        .send({
          name: 'Updated RoomMate',
          info: 'This is the updated roomMate!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedRoomMate = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedRoomMate = {};
    });

    it('should respond with the updated roomMate', function() {
      updatedRoomMate.name.should.equal('Updated RoomMate');
      updatedRoomMate.info.should.equal('This is the updated roomMate!!!');
    });

  });

  describe('DELETE /api/roomMates/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/roomMates/' + newRoomMate._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when roomMate does not exist', function(done) {
      request(app)
        .delete('/api/roomMates/' + newRoomMate._id)
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
