'use strict';

import mongoose from 'mongoose';
import {Schema} from 'mongoose';

var TaskSchema = new mongoose.Schema({
  _groupId: {
    type: Schema.ObjectId,
    ref: 'Group'
  },
  _creator: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    trim: true
  }, // name of the task
  assignees: [{  // people to which the task is assigned
    type: Schema.ObjectId,
    ref: 'Member'
  }],
  datetime: Date, // date and time of task
  doesRecur: { type: Boolean, default: false },
  recurType: String, // Daily/Weekly/Monthly/Yearly/Custom
  active: { type: Boolean, default: false } // taskIsActive
}, {
  timestamp: true
});

export default mongoose.model('Task', TaskSchema);
