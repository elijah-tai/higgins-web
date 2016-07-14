'use strict';

class GroupController {

  constructor($state, $stateParams, $scope, $rootScope, $uibModal, $log, groupService,
              memberService, taskService, alertService, socket) {
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$scope = $scope;
    this.$rootScope = $rootScope;

    // TODO: How can we access the deleteGroup() function from parent?
    this.$rootScope.deleteGroup = this.deleteGroup;

    this.$uibModal = $uibModal;
    this.$log = $log;
    this.socket = socket;

    this.editingGroupName = false;

    this.groupService = groupService;
    this.memberService = memberService;
    this.taskService = taskService;
    this.alertService = alertService;

    this.groupId = null;
    this.groupName = '';
    this.members = [];

    this.currentTasks = [];
    this.completedTasks = [];

    this.focusInput = {
      'groupName': false
    };

    $scope.$on('$destroy', () => {
      socket.unsyncUpdates('member');
    });

    $scope.$on('$destroy', () => {
      socket.unsyncUpdates('task');
    });

  }

  // NOTE: would it be possible to put this init into the constructor?
  init() {
    this.$rootScope.nav.getCurrentUser(function(user) {
      return user;
    }).then(user => {
        this.currentUser = user;
    });

    this.groupService.getGroup({ groupId: this.$stateParams.groupId })
      .then(response => {

        this.groupId = response.data._id;
        this.groupName = response.data.name;

        return this.groupService.populateMembers({ groupId: this.groupId });
      })
      .then(response => {

        this.members = response.data.members;
        this.socket.syncUpdates('member', this.members, this.currentUser._id);

        return this.groupService.populateTasks({ groupId: this.groupId });
      })
      .then(response => {

        this.currentTasks = response.data.tasks.filter(function( task ) {
          return task.active === true;
        });

        this.completedTasks = response.data.tasks.filter(function( task ) {
          return task.active === false;
        });

        this.socket.syncUpdates('task', this.currentTasks, this.currentUser._id);
      });
  }

  addMember(member) {
    // create member and add to group
    this.memberService.createMember({
      group: this.groupId,
      creator: this.currentUser._id,
      name: member.name,
      phone: parseInt(member.phone)
    })
      .then(response => {
        var memberId = response.data._id;
        var opts = {
          groupId: this.groupId,
          memberId: memberId
        };
        this.groupService.addMember( opts );
      });
  }

  editMember(member) {
    var opts = {
      memberId: member._id
    };
    var form = {
      name: member.name,
      phone: member.phone
    };
    this.memberService.editMember(opts, form);
  }

  deleteMember(member) {
    var opts = {
      memberId: member._id
    };
    this.memberService.deleteMember( opts );

    // TODO: Also need to delete them from all tasks
    // this.groupService.deleteMember( opts ); --> query tasks for members, then delete
  }

  openEditMemberModal(member) {
    var self = this;
    this.$uibModal
      .open({
        animation: true,
        backdrop: false,
        templateUrl: 'components/modals/memberModal/editMemberModal.html',
        controller: 'MemberModalController',
        controllerAs: 'memberModalCtrl',
        keyboard: true,
        size: 'sm',
        resolve: {
          member: function() {
            return member;
          }
        }
      })
      .result
      .then(function(editedMember) {
        self.editMember(editedMember);
      }, function() {
        self.$log.info('edit member modal dismissed');
      });
  }

  openAddMemberModal() {
    var self = this;
    this.$uibModal
      .open({
        animation: true,
        backdrop: false,
        templateUrl: 'components/modals/memberModal/addMemberModal.html',
        controller: 'MemberModalController',
        controllerAs: 'memberModalCtrl',
        keyboard: true,
        size: 'sm'
      })
      .result
      .then(function(addedMember) {
        // modal should have validated in front end
        self.addMember(addedMember);
      }, function() {
        self.$log.info('modal dismissed');
      });
  }

  /* jshint loopfunc:true */
  getMemberIds(assignees) {
    var memberIdArray = [];
    for (var id in assignees) {
      if (assignees[id] === true) {
        for (var rm in this.members) {
          if (this.members[rm]._id === id) {
            memberIdArray.push(id);
          }
        }
      }
    }

    return memberIdArray;
  }

  addTask(task) {

    var memberIds = this.getMemberIds( task.assignees );

    this.memberService.getMembersByIds({
      memberIds: memberIds
    })
      .then( response => {

        var membersArray = response.data;

        var mappedMemberIds = _.map( membersArray, function( member ) {
          return _.extend( member, _.findWhere( memberIds, member._id ) );
        });

        this.taskService.createTask({
          group: this.groupId,
          creator: this.currentUser._id,
          name: task.name,
          assignees: memberIds,
          datetime: task.datetime,
          doesRecur: task.doesRecur,
          recurType: task.recurType,
          reports: mappedMemberIds.map( function( assignee ) {
            return {
              assigneeId: assignee._id,
              assigneeName: assignee.name,
              status: 'pending'
            };
          }),
          active: true
        }).then(response => {
          this.groupService.addTask({
            groupId: this.groupId,
            taskId: response.data._id
          });
        });
      });
  }

  editTask(task) {
    var opts = {
      taskId: task._id
    };
    // the api task controller deletes the _id field
    var form = {
      name: task.name,
      assignees: this.getMemberIds(task.assignees),
      datetime: task.datetime,
      doesRecur: task.doesRecur,
      recurType: task.recurType,
      active: true
    };
    this.taskService.editTask(opts, form);
  }

  deleteTask(task) {
    this.taskService.deleteTask({taskId: task._id});
  }

  markTaskComplete(task) {
    var opts = {
      taskId: task._id
    };
    var form = {
      active: false
    };
    this.taskService.editTask(opts, form)
      .then(function() {

        this.completedTasks.push( task );

      });
  }

  openAddTaskModal() {
    var self = this;
    this.$uibModal.open({
      animation: true,
      backdrop: false,
      templateUrl: 'components/modals/taskModal/addTaskModal.html',
      controller: 'TaskModalController',
      controllerAs: 'taskModalCtrl',
      keyboard: true,
      size: 'md',
      resolve: {
        members: function() {
          return self.members;
        }
      }
    })
      .result
      .then(function(addedTask) {
        self.addTask(addedTask);
      }, function() {
        self.$log.info('add task modal dismissed');
      });
  }

  openEditTaskModal(task) {
    var self = this;
    this.$uibModal.open({
      animation: true,
      backdrop: false,
      templateUrl: 'components/modals/taskModal/editTaskModal.html',
      controller: 'TaskModalController',
      controllerAs: 'taskModalCtrl',
      keyboard: true,
      size: 'md',
      resolve: {
        members: function() {
          return self.members;
        },
        task: function() {
          return task;
        }
      }
    })
      .result
      .then(function(editedTask) {
        self.editTask(editedTask);
      }, function() {
        self.$log.info('edit task modal dismissed');
      });
  }

  editGroupName() {
    if (this.groupName === '') {
      this.alertService.showFormAlert('groupName');
      this.editingGroupName = true;
    } else {
      this.editingGroupName = false;
      this.groupService.updateGroup({ groupId: this.groupId }, { name: this.groupName });
    }
  }

  deleteGroup() {
    var self = this;
    this.$uibModal.open({
      animation: true,
      backdrop: false,
      templateUrl: 'components/modals/groupModal/confirmDeleteGroupModal.html',
      controller: 'GroupModalController',
      controllerAs: 'groupModalCtrl',
      keyboard: true,
      size: 'sm',
      resolve: {
        groupId: function() {
          return self.groupId;
        }
      }
    })
      .result
      .then(function(deletedGroupId) {
        self.groupService.deleteGroup({ groupId: deletedGroupId })
          .then(() => {
            self.$state.go('dashboard');
          });
      }, function() {
        self.$log.info('delete group modal dismissed');
      });
  }

  showMemberOptions(member) {
    if (typeof member.showOptions === 'undefined') {
      member.showOptions = true;
    } else if (member.showOptions === true){
      member.showOptions = false;
    } else {
      member.showOptions = true;
    }
  }

}

angular.module('higginsApp')
  .controller('GroupController', GroupController);
