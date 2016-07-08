/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/groups              ->  index
 * POST    /api/groups              ->  create
 * GET     /api/groups/:id          ->  show
 * PUT     /api/groups/:id          ->  update
 * DELETE  /api/groups/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import mongoose from 'mongoose';
import logger from 'winston';
import Group from './group.model';
import Task from '../task/task.model';
import Member from '../member/member.model';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
      logger.info('groupController.respondWithResult - entity: ' + entity);
      return res;
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.extend(entity, updates);
    return updated.save()
      .then(updated => {
        logger.info('groupController.saveUpdates - updated: ' + updated);
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
          return res;
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Groups
export function index(req, res) {
  return Group.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Group from the DB
export function show(req, res) {
  return Group.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Group in the DB, attaching its ObjectId to User who created it
export function create(req, res) {
  var newGroup = new Group(req.body);
  logger.info('groupController.create - req.body: ' + req.body);
  return newGroup.save()
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Group in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Group.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Group from the DB
export function destroy(req, res) {
  return Group.findById(req.params.id, function(err, group) {
    if (err) logger.error(err);
    Task.remove({_id: {$in: group.tasks}}).exec();
    Member.remove({_id: {$in: group.members}}).exec();
  }).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}


// Get an array of all of user's groups.
export function getGroups(req, res, next) {
  var userId = req.params.userId;
  return Group.find({ _creator: userId }).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Add a member to a group
export function addMember(req, res) {
  var groupId = req.params.id;
  var memberId = req.params.memberId;

  // TODO: Change this to use chains
  return Group.findById(groupId, function(err, group) {
    if (err) {
      logger.info('groupController.addMember - group not found');
      return res.status(404).end();
    }

    group.members.addToSet(new mongoose.Types.ObjectId(memberId));
    group.save(function(err) {
      if (err) {
        logger.error('groupController.addMember - error saving group')
      }
      logger.info('groupController.addMember - group saved: ' + group);
      res.status(200).json(group).end();
      return res;
    });
  });
}

export function addTask(req, res) {
  var groupId = req.params.id;
  var taskId = req.params.taskId;

  return Group.findById(groupId).exec()
    .then(handleEntityNotFound(res))
    .then(group => {
      group.tasks.addToSet(new mongoose.Types.ObjectId(taskId));
      group.save()
        .then(respondWithResult(res, 201))
        .catch(handleError(res));
    })
}

// Populates an array of member ids with member data
export function populateMembers(req, res) {
  var groupId = req.params.id;
  return Group.findById(groupId)
    .populate('members').exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res))
}


// Populates an array of task ids with task data
export function populateTasks(req, res) {
  var groupId = req.params.id;
  return Group.findById(groupId)
    .populate('tasks').exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res))
}
