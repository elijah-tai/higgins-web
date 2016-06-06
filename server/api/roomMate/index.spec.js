'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var roommateCtrlStub = {
  index: 'roommateCtrl.index',
  show: 'roommateCtrl.show',
  create: 'roommateCtrl.create',
  update: 'roommateCtrl.update',
  destroy: 'roommateCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var roommateIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './roommate.controller': roommateCtrlStub
});

describe('Roommate API Router:', function() {

  it('should return an express router instance', function() {
    roommateIndex.should.equal(routerStub);
  });

  describe('GET /api/roommates', function() {

    it('should route to roommateModal.controller.index', function() {
      routerStub.get
        .withArgs('/', 'roommateCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/roommates/:id', function() {

    it('should route to roommateModal.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'roommateCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/roommates', function() {

    it('should route to roommateModal.controller.create', function() {
      routerStub.post
        .withArgs('/', 'roommateCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/roommates/:id', function() {

    it('should route to roommateModal.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'roommateCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/roommates/:id', function() {

    it('should route to roommateModal.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'roommateCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/roommates/:id', function() {

    it('should route to roommateModal.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'roommateCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
