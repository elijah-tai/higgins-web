/**
 * Room model events
 */

'use strict';

import {EventEmitter} from 'events';
import Room from './room.model';
var RoomEvents = new EventEmitter();
import logger from 'winston';

// Set max event listeners (0 == unlimited)
RoomEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Room.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    logger.info('Emitting room model event: ' + event + ', doc._id:' + doc._id + ', doc._creator:' + doc._creator);
    RoomEvents.emit(event + ':' + doc._id + ':' + doc._creator, doc);
    logger.info('Emitting room model event: ' + event);
    RoomEvents.emit(event, doc);
  }
}

export default RoomEvents;
