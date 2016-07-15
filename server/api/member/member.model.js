'use strict';

import mongoose from 'mongoose';
import {Schema} from 'mongoose';

var MemberSchema = new mongoose.Schema({
  group: {        // id of group that member is attached to
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
  },     // name of member
  phone: {
    type: Number,
    required: true
  },    // member phone number
  active: { type: Boolean, default: true }
}, {
  timestamps: true
});

export default mongoose.model('Member', MemberSchema);
