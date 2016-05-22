'use strict';

describe('Component: HomeComponent', function () {

  // load the controller's module
  beforeEach(module('higginsApp'));

  var HomeComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    HomeComponent = $componentController('HomeComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
