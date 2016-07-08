'use strict';

angular.module('higginsApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('group', {
        url: '/group/:groupId',
        templateUrl: 'app/group/group.html',
        authenticate: true,
        controller: 'GroupController',
        controllerAs: 'groupCtrl'
      });
  });
