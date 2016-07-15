'use strict';

var express = require('express');
var controller = require('./group.controller.js');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

router.get('/:userId/groups', controller.getGroups);

router.get('/:id/populate-members', controller.populateMembers);
router.get('/:id/populate-tasks', controller.populateTasks);

router.put('/:id/add-member/:memberId', controller.addMember);
router.put('/:id/remove-member/:memberId', controller.removeMember);
router.put('/:id/add-task/:taskId', controller.addTask);

// TODO: Need equivalent calls for removing members and tasks

module.exports = router;
