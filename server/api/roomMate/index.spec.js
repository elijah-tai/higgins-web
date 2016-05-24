'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var roomMateCtrlStub = {
  index: 'roomMateCtrl.index',
  show: 'roomMateCtrl.show',
  create: 'roomMateCtrl.create',
  update: 'roomMateCtrl.update',
  destroy: 'roomMateCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var roomMateIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './roomMate.controller': roomMateCtrlStub
});

describe('RoomMate API Router:', function() {

  it('should return an express router instance', function() {
    roomMateIndex.should.equal(routerStub);
  });

  describe('GET /api/roomMates', function() {

    it('should route to roomMate.controller.index', function() {
      routerStub.get
        .withArgs('/', 'roomMateCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/roomMates/:id', function() {

    it('should route to roomMate.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'roomMateCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/roomMates', function() {

    it('should route to roomMate.controller.create', function() {
      routerStub.post
        .withArgs('/', 'roomMateCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/roomMates/:id', function() {

    it('should route to roomMate.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'roomMateCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/roomMates/:id', function() {

    it('should route to roomMate.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'roomMateCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/roomMates/:id', function() {

    it('should route to roomMate.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'roomMateCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
