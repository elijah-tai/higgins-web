'use strict';

describe('Controller: RoomController', function () {

  // load the controller's module
  beforeEach(module('higginsApp'));

  var RoomController, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    RoomController = $componentController('RoomController', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
