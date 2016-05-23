'use strict';

class RoomController {

  constructor($http, $state) {
    this.$http = $http;
    this.$state = $state;
  }

}

angular.module('higginsApp')
  .controller('RoomController', RoomController);
