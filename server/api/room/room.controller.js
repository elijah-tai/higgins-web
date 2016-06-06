/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/rooms              ->  index
 * POST    /api/rooms              ->  create
 * GET     /api/rooms/:id          ->  show
 * PUT     /api/rooms/:id          ->  update
 * DELETE  /api/rooms/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import mongoose from 'mongoose';
import logger from 'winston';
import Room from './room.model';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
      logger.info('roomController.respondWithResult - entity: ' + entity);
      return res;
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.extend(entity, updates);
    return updated.save()
      .then(updated => {
        logger.info('roomController.saveUpdates - updated: ' + updated);
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

// Gets a list of Rooms
export function index(req, res) {
  return Room.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Room from the DB
export function show(req, res) {
  return Room.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Room in the DB, attaching its ObjectId to User who created it
export function create(req, res) {
  var newRoom = new Room(req.body);
  logger.info('roomController.create - req.body: ' + req.body);
  return newRoom.save()
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Room in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Room.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Room from the DB
export function destroy(req, res) {
  return Room.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

// TODO: Clean up the functions below to use chained functions!
/**
 * Get an array of all of user's rooms.
 */
export function getRooms(req, res, next) {
  var userId = req.params.userId;
  return Room.find({ _creator: userId }).exec()
    .then(rooms => {
      if (!rooms) {
        logger.info('roomController.getRooms - rooms not found');
        return res.status(404).end();
      }
      logger.info('roomController.getRooms: ' + rooms + ' returned')
      res.status(200).json(rooms).end();
      return res;
    })
    .catch(err => next(err));
}

/*
  Add a roommate to a room
 */
export function addRoommate(req, res, next) {
  var roomId = req.params.id;
  var roommateId = req.params.roommateId;
  // TODO: Change this to use chains
  return Room.findOne({ _id: roomId }, function(err, room) {
    if (err) {
      logger.info('roomController.addRoommate - room not found');
      return res.status(404).end();
    }

    room.roommates.addToSet(new mongoose.Types.ObjectId(roommateId));
    room.save(function(err) {
      if (err) {
        logger.error('roomController.addRoommate - error saving room')
      }
      logger.info('roomController.addRoommate - room saved: ' + room);
      res.status(200).json(room).end();
      return res;
    });
  });
}
