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

            this.socket.syncUpdates('group', this.groups, this.currentUser._id);

          });
      });
  }

  goToGroup(group) {
    this.$rootScope.currentGroup = group;
    this.$state.go('group.tasks', { groupId: group._id });
  }

  createGroup() {

    var groupId,
        member,
        self = this;

    if (!!this.groupName && !!this.currentUser) {
      this.groupService.createGroup({
        creator: this.currentUser._id,
        name: this.groupName
      })
        .then(response => {
          groupId = response.data._id;
          this.$rootScope.currentGroup = response.data;
          return this.userService.updateUserGroups({userId: this.currentUser._id}, {groupId: groupId});
        })
        .then(() => {

          this.memberService.findMemberByPhone({
            phone: this.currentUser.phone
          })
            .success(function (member) {

              self.groupService.addMember({
                groupId: groupId,
                memberId: member._id
              })
                .then(response => {
                  self.memberService.getMembersByIds(response.data.members)
                    .then(function() {
                      self.checkHasGroups();
                      self.groupName = '';
                    });
                });

            })
            .error(function () {

              self.memberService.createMember({
                group: groupId,
                creator: self.currentUser._id,
                name: self.currentUser.name,
                phone: parseInt(self.currentUser.phone)
              })
                .then(response => {

                  var memberId = response.data._id;
                  var opts = {
                    groupId: groupId,
                    memberId: memberId
                  };

                  self.groupService.addMember(opts)
                    .then(response => {
                      self.memberService.getMembersByIds(response.data.members)
                        .then(function() {
                          self.checkHasGroups();
                          self.groupName = '';
                        });
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
    if (this.groups === [] || this.groups.length === 0 || typeof this.groups === 'undefined') {
      this.hasGroups = false;
    } else {
      this.hasGroups = true;
    }
  }

}

angular.module('higginsApp')
  .controller('DashboardController', DashboardController);
