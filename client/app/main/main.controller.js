'use strict';

(function() {

  class MainController {

    constructor($scope, $rootScope) {
      this.$rootScope = $rootScope;
      this.$scope = $scope;

      $rootScope.$on('$stateChangeStart', () => {
        
      });
    }

    $onInit() {
      this.$rootScope.nav.isHome = true;
    }

  }

  angular.module('higginsApp')
    .component('main', {
      templateUrl: 'app/main/main.html',
      controller: MainController
    });
})();
