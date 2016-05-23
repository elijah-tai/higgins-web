/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import Room from '../api/room/room.model';
import User from '../api/user/user.model';

Room.find({}).remove()
  .then(() => {
    Room.create({
      name: 'Test Room',
      info: '123 Alphabet Street',
      active: true,
      roomMates: [
        {
          name: 'Bob',
          pn: '123-456-7890'
        }
      ]
    })
    .then(() => {
      console.log('finished populating rooms');
    });
  });

User.find({}).remove()
  .then(() => {
    User.create({
      provider: 'local',
      name: 'Test User',
      email: 'test@example.com',
      password: 'test'
    }, {
      provider: 'local',
      role: 'admin',
      name: 'Admin',
      email: 'admin@example.com',
      password: 'admin'
    })
    .then(() => {
      console.log('finished populating users');
    });
  });
