'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var taskCtrlStub = {
  index: 'taskCtrl.index',
  show: 'taskCtrl.show',
  create: 'taskCtrl.create',
  update: 'taskCtrl.update',
  destroy: 'taskCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var taskIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './task.controller': taskCtrlStub
});

describe('Task API Router:', function() {

  it('should return an express router instance', function() {
    taskIndex.should.equal(routerStub);
  });

  describe('GET /api/tasks', function() {

    it('should route to task.controller.index', function() {
      routerStub.get
        .withArgs('/', 'taskCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/tasks/:id', function() {

    it('should route to task.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'taskCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/tasks', function() {

    it('should route to task.controller.create', function() {
      routerStub.post
        .withArgs('/', 'taskCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/tasks/:id', function() {

    it('should route to task.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'taskCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/tasks/:id', function() {

    it('should route to task.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'taskCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/tasks/:id', function() {

    it('should route to task.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'taskCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
