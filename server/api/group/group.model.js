'use strict';

import mongoose from 'mongoose';
import {Schema} from 'mongoose';

var GroupSchema = new mongoose.Schema({
  _creator: {       // id of the owner of the group
    type: Schema.ObjectId,
    ref: 'User'
  },
  name: { // name of group
    type: String,
    trim: true
  },
  address: { // address of group
    type: String,
    trim: true
  },
  active: { // for checking that group is used
    type: Boolean,
    default: true
  },
  members: [{     // array of members that share the group
    type: Schema.ObjectId,
    ref: 'Member'
  }],
  tasks: [{     // array of tasks attached to group
    type: Schema.ObjectId,
    ref: 'Task'
  }]
}, {
  timestamp: true
});

export default mongoose.model('Group', GroupSchema);
