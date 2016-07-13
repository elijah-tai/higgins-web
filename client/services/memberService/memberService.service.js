'use strict';

angular.module('higginsApp.memberService', [])
  .factory('memberService', function ($http) {

    var getMember = function( opts ) {
      return $http.get('/api/members/' + opts.memberId);
    };

    var getMembersByIds = function( form ) {
      return $http.post('/api/members/findByIds', form );
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
      getMembersByIds: getMembersByIds,
      createMember: createMember,
      deleteMember: deleteMember,
      editMember: editMember
    };
  });
