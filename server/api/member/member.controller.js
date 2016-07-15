/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/members              ->  index
 * POST    /api/members              ->  create
 * GET     /api/members/:id          ->  show
 * PUT     /api/members/:id          ->  update
 * DELETE  /api/members/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import logger from 'winston';
import Member from './member.model';
import Group from '../group/group.model';
import mongoose from 'mongoose';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
      return res;
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.extend(entity, updates);
    return updated.save()
      .then(updated => {
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

// Gets a list of Members
export function index(req, res) {
  return Member.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Member from the DB
export function show(req, res) {
  return Member.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Member in the DB
export function create(req, res) {
  return Member.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Member in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Member.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Member from the DB
export function destroy(req, res) {
  return Member.findById(req.params.id, function(err, member) {

    Group.update(
      {_id: member.group},
      {$pullAll: {members: [new mongoose.Types.ObjectId(req.params.id)]}},
      null, function(err, result) {
        if (err) {
          logger.error(err);
        }
        logger.info('`member.controller.destroy` - member successfully removed from group. Ok status: ' + result.ok);
      });

  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

export function findByIds(req, res) {
  return Member.find( { _id: { $in : req.body } } )
    .sort({ createdAt: 1 })
    .exec()
    .then( respondWithResult(res) )
    .catch( handleError(res) );
}

export function findByPhone(req, res) {
  return Member.findOne( { phone: req.body.phone } ).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}
