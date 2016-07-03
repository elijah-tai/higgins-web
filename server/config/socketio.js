/**
 * Socket.io configuration
 */
'use strict';

import config from './environment';

// When the user disconnects.. perform this
function onDisconnect(socket) {
}

// When the user connects.. perform this
function onConnect(socket) {
}

export default function(socketio) {
  // socket.io (v1.x.x) is powered by debug.
  // In order to see all the debug output, set DEBUG (in server/config/local.env.js) to including the desired scope.
  //
  // ex: DEBUG: "http*,socket.io:socket"

  // We can authenticate socket.io users and access their token through socket.decoded_token
  //
  // 1. You will need to send the token in `client/components/socket/socket.service.js`
  //
  // 2. Require authentication here:
  // socketio.use(require('socketio-jwt').authorize({
  //   secret: config.secrets.session,
  //   handshake: true
  // }));

  // Insert sockets below
  require('../api/reminder/reminder.socket').register(socketio);
  require('../api/roommate/roommate.socket').register(socketio);
  require('../api/room/room.socket').register(socketio);

  socketio.on('connection', function(socket) {
    socket.address = socket.request.connection.remoteAddress +
      ':' + socket.request.connection.remotePort;

    socket.connectedAt = new Date();

    socket.log = function(...data) {
      console.log(`SocketIO ${socket.nsp.name} [${socket.address}]`, ...data);
    };

    socket.on('info', data => {
      socket.log(JSON.stringify(data, null, 2));
    });

    socket.on('join', function(data) {
      socket.join(data.userId);
    });

    socket.on('leave', function(data) {
      socket.leave(data.userId);
    });

    // Call onDisconnect.
    socket.on('disconnect', () => {
      onDisconnect(socket);
      socket.log('DISCONNECTED');
    });
  });
}
