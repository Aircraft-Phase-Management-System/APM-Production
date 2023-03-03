import { Meteor } from 'meteor/meteor';
import { Stuffs } from '../../api/stuff/StuffCollection';
import { Holidays } from '../../api/holiday/HolidayCollection'
import { Phases  } from '../../api/phase/PhaseCollection';
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

// Initialize the database with a default holiday data document.
function addHolidayData(data) {
  console.log(`  Adding: ${data.title} (${data.owner})`);
  Holidays.define(data);
}


if (Holidays.count() === 0) {
  if (Meteor.settings.defaultHolidays) {
    console.log('Creating default data for holidays.');
    Meteor.settings.defaultHolidays.map(data => addHolidayData(data));
  }
}

// Initialize the database with a default PMI data document.
function addPMIData(data) {
  console.log(`  Adding: ${data.title} (${data.owner})`);
  Phases.define(data);
}


if (Phases.count() === 0) {
  if (Meteor.settings.defaultPMIs) {
    console.log('Creating default data for PMI events.');
    Meteor.settings.defaultPMIs.map(data => addPMIData(data));
  }
}


