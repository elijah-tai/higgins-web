'use strict';

class DashboardController {

  constructor($state, $rootScope, $scope, $timeout, groupService, memberService, userService, socket) {
    this.$state = $state;
    this.$rootScope = $rootScope;
    this.$rootScope.currentGroup = null;
    this.$scope = $scope;
    this.$timeout = $timeout;

    this.groupService = groupService;
    this.memberService = memberService;
    this.userService = userService;
    this.socket = socket;

    this.currentUser = null;
    this.groupName = '';
    this.hasGroups = false;
    this.groups = [];

    $scope.$on('$destroy', () => {
      socket.unsyncUpdates('group');
    });
  }

  init() {
    this.$rootScope.nav.getCurrentUser(function(user) {
      return user;
    })
      .then(user => {
        this.currentUser = user;
        this.groupService.getGroupsByUserId({ userId: user._id })
          .then(groups => {
            this.groups = groups.data;
            this.socket.emit('join', {userId: user._id});

            if (typeof this.groups !== 'undefined' && this.groups.length > 0) {
              this.hasGroups = true;
            }
          });
      });
  }

  goToGroup(group) {
    this.$rootScope.currentGroup = group;
    this.$state.go('group', { groupId: group._id });
  }

  createGroup() {
    this.socket.syncUpdates('group', this.groups, this.currentUser._id);
    if (!!this.groupName && !!this.currentUser) {
      this.groupService.createGroup({
        creator: this.currentUser._id,
        name: this.groupName
      })
        .then(response => {
          var groupId = response.data._id;
          this.$rootScope.currentGroup = response.data;
          this.$rootScope.nav.getCurrentUser(function(user) {
            return user;
          })
            .then(user => {
              this.userService.updateUserGroups({ userId: user._id }, { groupId: groupId })
                .then(() => {
                  this.memberService.createMember({
                    group: groupId,
                    creator: user._id,
                    name: user.name,
                    phone: user.phone
                  })
                    .then((response) => {
                      var memberId = response.data._id;
                      this.groupService.addMember({ groupId: groupId, memberId: memberId });
                      this.checkHasGroups();
                      this.groupName = '';
                    });
                });
            });
        });
    }
  }

  deleteGroup(group) {
    // TODO: should show confirmation modal
    this.groupService.deleteGroup({ groupId: group._id })
      .then(() => {
        this.checkHasGroups();
      });
  }

  checkHasGroups() {
    if (typeof this.groups !== 'undefined' && this.groups.length > 0) {
      this.hasGroups = true;
    } else {
      this.hasGroups = false;
    }
  }

}

angular.module('higginsApp')
  .controller('DashboardController', DashboardController);
