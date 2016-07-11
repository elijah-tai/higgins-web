'use strict';

import mongoose from 'mongoose';
import {Schema} from 'mongoose';

var TaskSchema = new mongoose.Schema({
  ref: {
    type: String,
    required: true
  },
  group: {
    type: Schema.ObjectId,
    ref: 'Group',
    required: true
  },
  creator: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    trim: true,
    required: true
  }, // name of the task
  assignees: [{  // people to which the task is assigned
    type: Schema.ObjectId,
    ref: 'Member'
  }],
  datetime: {
    type: Date,
    required: true
  }, // date and time of task
  report: [{
    assignee: {
      type: Schema.ObjectId,
      ref: 'Member',
      required: true
    },
    status: {
      type: String, // pending/accepted/rejected/unfinished/finished
      required: true
    }
  }],
  doesRecur: { type: Boolean, default: false },
  recurType: String, // Daily/Weekly/Monthly/Yearly/Custom
  active: { type: Boolean, default: false } // taskIsActive
}, {
  timestamp: true
});

export default mongoose.model('Task', TaskSchema);
