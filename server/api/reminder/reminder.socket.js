/**
 * Broadcast updates to client when the model changes
 */

'use strict';

import ReminderEvents from './reminder.events';

// Model events to emit
var events = ['save', 'remove'];

export function register(socketio) {
  // Bind model events to socket events
  for (var i = 0, eventsLength = events.length; i < eventsLength; i++) {
    var event = events[i];
    var listener = createListener('reminder:' + event, socketio);

    ReminderEvents.on(event, listener);
    socketio.on('disconnect', removeListener(event, listener));
  }
}


function createListener(event, io) {
  return function(doc) {
    io.sockets.in(doc._creator).emit(event + ':' + doc._creator, doc);
  };
}

function removeListener(event, listener) {
  return function() {
    ReminderEvents.removeListener(event, listener);
  };
}
