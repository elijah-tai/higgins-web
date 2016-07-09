'use strict';

describe('Controller: GroupController', function () {

  // load the controller's module
  beforeEach(module('higginsApp'));

  var GroupController, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    GroupController = $componentController('GroupController', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
