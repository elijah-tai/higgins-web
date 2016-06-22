'use strict';

class NavbarController {

  constructor(Auth) {
    this.isLoggedIn = Auth.isLoggedIn;
    this.isAdmin = Auth.isAdmin;
    this.getCurrentUser = Auth.getCurrentUser;
    this.isCollapsed = true;
  }

}

angular.module('higginsApp')
  .controller('NavbarController', NavbarController);
