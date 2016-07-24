'use strict';

angular.module('higginsApp.userService', [])
  .factory('userService', function ($http, $q) {

    var updateUserGroups = function( opts, form ) {
      var userId = opts.userId;
      return $http.post('/api/users/' + userId + '/add-group', form);
    };

    var getFBLoginStatus = function() {
      var deferred = $q.defer();

      FB.getLoginStatus(function( response ) {
        if ( !!response ) {
          deferred.resolve( response );
        } else {
          deferred.reject( 'No response' );
        }
      });

      return deferred.promise;
    };

    var getFBFriends = function( opts ) {
      var deferred = $q.defer();
      var accessToken = opts.accessToken;

      FB.api('/me/friends?access_token=' + accessToken, function( response ) {
        if ( response && !response.error ) {
          deferred.resolve( response );
        } else {
          deferred.reject( 'Error occurred' );
        }
      });

      return deferred.promise;
    };

    // Public API here
    return {
      updateUserGroups: updateUserGroups,
      getFBLoginStatus: getFBLoginStatus,
      getFBFriends: getFBFriends
    };
  });
