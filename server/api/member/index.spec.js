'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var memberCtrlStub = {
  index: 'memberCtrl.index',
  show: 'memberCtrl.show',
  create: 'memberCtrl.create',
  update: 'memberCtrl.update',
  destroy: 'memberCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var memberIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './member.controller': memberCtrlStub
});

describe('Member API Router:', function() {

  it('should return an express router instance', function() {
    memberIndex.should.equal(routerStub);
  });

  describe('GET /api/members', function() {

    it('should route to member.controller.index', function() {
      routerStub.get
        .withArgs('/', 'memberCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/members/:id', function() {

    it('should route to member.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'memberCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/members', function() {

    it('should route to member.controller.create', function() {
      routerStub.post
        .withArgs('/', 'memberCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/members/:id', function() {

    it('should route to member.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'memberCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/members/:id', function() {

    it('should route to member.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'memberCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/members/:id', function() {

    it('should route to member.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'memberCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
