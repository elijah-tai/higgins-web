'use strict';

angular.module('higginsApp.memberService', [])
  .factory('memberService', function ($http) {

    var getMember = function( opts ) {
      return $http.get('/api/members/' + opts.memberId);
    };

    var createMember = function( form ) {
      return $http.post('/api/members', form);
    };

    var deleteMember = function( opts ) {
      return $http.delete('/api/members/' + opts.memberId);
    };

    var editMember = function( opts, form ) {
      return $http.put('/api/members/' + opts.memberId, form);
    };

    // Public API here
    return {
      getMember: getMember,
      createMember: createMember,
      deleteMember: deleteMember,
      editMember: editMember
    };
  });
