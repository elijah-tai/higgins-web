'use strict';

import mongoose from 'mongoose';
import {Schema} from 'mongoose';

var ReminderSchema = new mongoose.Schema({
  name: String, // name of the reminder
  assignees: [{  // people to which the reminder is assigned
    type: Schema.ObjectId,
    ref: 'RoomMate'
  }],
  datetime: Date, // date and time of reminder
  recurs: {
    type: String, // daily/weekly/monthly/custom
    doesRecur: { type: Boolean, default: false }
  },
  active: { type: Boolean, default: false } // reminderIsActive
});

export default mongoose.model('Reminder', ReminderSchema);
