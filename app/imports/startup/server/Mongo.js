import { Meteor } from 'meteor/meteor';
import { Stuffs } from '../../api/stuff/StuffCollection';
import { Timeouts } from '../../api/timeout/TimeoutCollection';
import { Events  } from '../../api/event_phase/EventCollection';
import { Phases } from '../../api/phase_lane/PhaseCollection';
/* eslint-disable no-console */

// Initialize the database with a default data document.
function addData(data) {
  console.log(`  Adding: ${data.name} (${data.owner})`);
  Stuffs.define(data);
}

// Initialize the StuffsCollection if empty.
if (Stuffs.count() === 0) {
  if (Meteor.settings.defaultData) {
    console.log('Creating default data.');
    Meteor.settings.defaultData.map(data => addData(data));
  }
}

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

// Initialize the database with a default event data document.
function addEvent(data) {
  console.log(`  Adding: ${data.title} (${data.owner})`);
  Events.define(data);
}


if (Events.count() === 0) {
  if (Meteor.settings.defaultEvents) {
    console.log('Creating default data for events for Phase Lanes.');
    Meteor.settings.defaultEvents.map(data => addEvent(data));
  }
}

// Initialize the database with a default event data document.
function addPhase(data) {
  console.log(`  Adding: ${data.name} (${data.owner})`);
  Phases.define(data);
}


if (Phases.count() === 0) {
  if (Meteor.settings.defaultPhaseLanes) {
    console.log('Creating default data for Phase Lanes.');
    Meteor.settings.defaultPhaseLanes.map(data => addPhase(data));
  }
}


