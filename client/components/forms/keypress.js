'use strict';

angular.module('higginsApp')
  .directive('onEnter', function () {
    return function (scope, element, attrs) {
        element.bind('keydown keypress', function (e) {
            var key = typeof e.which === 'undefined' ? e.keyCode : e.which;
            if(key === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.onEnter);
                });
                e.preventDefault();
            }
        });
    };
  });