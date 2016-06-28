'use strict';

describe('Controller: HomeController', function () {

  // load the controller's module
  beforeEach(module('higginsApp'));

  var HomeController, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    HomeController = $componentController('HomeComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
