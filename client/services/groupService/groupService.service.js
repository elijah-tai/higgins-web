'use strict';

angular.module('higginsApp.groupService', [])
  .factory('groupService', function ($http) {

    var getGroup = function( opts ) {
      var groupId = opts.groupId;
      return $http.get('/api/groups/' + groupId);
    };

    var getGroupsByUserId = function( opts ) {
      var userId = opts.userId;
      return $http.get('/api/groups/' + userId + '/groups');
    };

    var createGroup = function( form ) {
      return $http.post('/api/groups', form);
    };

    var updateGroup = function( opts, form ) {
      var groupId = opts.groupId;
      return $http.put('/api/groups/' + groupId, form);
    };

    var deleteGroup = function( opts ) {
      var groupId = opts.groupId;
      return $http.delete('/api/groups/' + groupId );
    };

    var addMember = function( opts ) {
      var groupId = opts.groupId;
      var memberId = opts.memberId;
      return $http.put('/api/groups/' + groupId + '/add-member/' + memberId);
    };

    var addTask = function( opts ) {
      var groupId = opts.groupId;
      var taskId = opts.taskId;
      return $http.put('/api/groups/' + groupId + '/add-task/' + taskId);
    };

    var populateMembers = function( opts ) {
      var groupId = opts.groupId;
      return $http.get('/api/groups/' + groupId + '/populate-members');
    };

    var populateTasks = function( opts ) {
      var groupId = opts.groupId;
      return $http.get('/api/groups/' + groupId + '/populate-tasks');
    };

    // Public API here
    return {
      createGroup: createGroup,
      getGroup: getGroup,
      updateGroup: updateGroup,
      deleteGroup: deleteGroup,
      getGroupsByUserId: getGroupsByUserId,
      addTask: addTask,
      addMember: addMember,
      populateMembers: populateMembers,
      populateTasks: populateTasks
    };
  });
