/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import Group from '../api/group/group.model';
import User from '../api/user/user.model';
import Member from '../api/member/member.model';
import Task from '../api/task/task.model';
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
          Group.update({ name: 'Test Group' }, { $set: { creator: user._id }})
            .then(() => {
              logger.info('finished adding Test User to Test Group\'s creator field');
            })
            .then(() => {
              Group.findOne({ name: 'Test Group' }, function(err, group) {
                User.update({ name: 'Test User' }, { $push: { groups: group._id }})
                  .then(() => {
                    logger.info('finished adding Test Group to Test User\'s groups array');
                  })
              })
            })
        })
      });
  });

Group.find({}).remove()
  .then(() => {
    Group.create({
      name: 'Test Group',
      info: '123 Alphabet Street',
      active: true,
      members: []
    })
    .then(() => {
      logger.info('finished populating groups');
    });
  });

// Member.find({}).remove()
//   .then(() => {
//     Member.create({
//       name: 'WonJune',
//       phone: 4169099753
//     },{
//       name: 'Test2',
//       phone: 234567819
//     })
//       .then(() => {
//         logger.info('finished populating members');
//       });
//   });
