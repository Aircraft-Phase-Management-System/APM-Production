import { Meteor } from 'meteor/meteor';
import { Timeouts } from '../../api/timeout/TimeoutCollection';
/* eslint-disable no-console */

// Initialize the database with a default timeout data document.
function addTimeout(data) {
  console.log(`  Adding: ${data.title}`);
  Timeouts.define(data);
}

if (Timeouts.count() === 0) {
  if (Meteor.settings.defaultTimeouts) {
    console.log('Creating default data for Timeouts.');
    Meteor.settings.defaultTimeouts.map(data => addTimeout(data));
  }
}


