'use strict';

import mongoose from 'mongoose';
import {Schema} from 'mongoose';

var MemberSchema = new mongoose.Schema({
  _groupId: {        // id of group that member is attached to
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
  },     // name of member
  phone: {
    type: Number
  },    // member phone number
  active: { type: Boolean, default: true }
});

export default mongoose.model('Member', MemberSchema);
