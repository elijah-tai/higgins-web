'use strict';

angular.module( 'higginsApp' )
  .config(function( $stateProvider ) {
    $stateProvider
      .state( 'group', {
        url: '/group/:groupId',
        templateUrl: 'app/group/group.html',
        authenticate: true,
        controller: 'GroupController',
        controllerAs: 'groupCtrl'
      })

      .state( 'group.tasks', {
        url: '/tasks',
        authenticate: true,
        templateUrl: 'app/group/partials/tasks.html'
      })

      .state( 'group.members', {
        url: '/members',
        authenticate: true,
        templateUrl: 'app/group/partials/members.html'
      });

  });
