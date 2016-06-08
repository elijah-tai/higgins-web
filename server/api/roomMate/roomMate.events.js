/**
 * Roommate model events
 */

'use strict';

import {EventEmitter} from 'events';
import Roommate from './roommate.model';
var RoommateEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
RoommateEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Roommate.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    RoommateEvents.emit(event + ':' + doc._id, doc);
    RoommateEvents.emit(event, doc);
  }
}

export default RoommateEvents;
