'use strict';

describe('Service: roommateService', function () {

  // load the service's module
  beforeEach(module('higginsApp.roommateService'));

  // instantiate service
  var roommatesService;
  beforeEach(inject(function (_roommatesService_) {
    roommatesService = _roommatesService_;
  }));

  it('should do something', function () {
    expect(!!roommatesService).toBe(true);
  });

});
