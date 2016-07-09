'use strict';

describe('Service: memberService', function () {

  // load the service's module
  beforeEach(module('higginsApp.memberService'));

  // instantiate service
  var membersService;
  beforeEach(inject(function (_membersService_) {
    membersService = _membersService_;
  }));

  it('should do something', function () {
    expect(!!membersService).toBe(true);
  });

});
