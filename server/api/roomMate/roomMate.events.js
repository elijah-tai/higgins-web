/**
 * RoomMate model events
 */

'use strict';

import {EventEmitter} from 'events';
import RoomMate from './roomMate.model';
var RoomMateEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
RoomMateEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  RoomMate.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    RoomMateEvents.emit(event + ':' + doc._id, doc);
    RoomMateEvents.emit(event, doc);
  }
}

export default RoomMateEvents;
