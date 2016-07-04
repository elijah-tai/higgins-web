/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import Room from '../api/room/room.model';
import User from '../api/user/user.model';
import Roommate from '../api/roommate/roommate.model';
import Reminder from '../api/reminder/reminder.model';
import logger from 'winston';

User.find({}).remove()
  .then(() => {
    User.create({
      provider: 'local',
      name: 'Test User',
      email: 'test@example.com',
      password: 'test',
      phone: 4169099753
    }, {
      provider: 'local',
      role: 'admin',
      name: 'Admin',
      email: 'admin@example.com',
      password: 'admin'
    })
      .then(() => {
        logger.info('finished populating users');
      })
      .then(() => {
        User.findOne({ name: 'Test User' }, function(err, user) {
          Room.update({ name: 'Test Room' }, { $set: { _creator: user._id }})
            .then(() => {
              logger.info('finished adding Test User to Test Room\'s _creator field');
            })
            .then(() => {
              Room.findOne({ name: 'Test Room' }, function(err, room) {
                User.update({ name: 'Test User' }, { $push: { rooms: room._id }})
                  .then(() => {
                    logger.info('finished adding Test Room to Test User\'s rooms array');
                  })
              })
            })
        })
      });
  });

Room.find({}).remove()
  .then(() => {
    Room.create({
      name: 'Test Room',
      info: '123 Alphabet Street',
      active: true,
      roommates: []
    })
    .then(() => {
      logger.info('finished populating rooms');
    });
  });

// Roommate.find({}).remove()
//   .then(() => {
//     Roommate.create({
//       name: 'WonJune',
//       phone: 4169099753
//     },{
//       name: 'Test2',
//       phone: 234567819
//     })
//       .then(() => {
//         logger.info('finished populating roommates');
//       });
//   });
