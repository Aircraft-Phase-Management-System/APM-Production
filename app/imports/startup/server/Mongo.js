import { Meteor } from 'meteor/meteor';
import { Stuffs } from '../../api/stuff/StuffCollection';
import { Holidays } from '../../api/holiday/HolidayCollection'
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

// Initialize the database with a default data document.
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

