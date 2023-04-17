import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import faker from 'faker';
import { EventsDay, eventTypes } from './EventDayCollection';
import { defineTestUser, withLoggedInUser, withSubscriptions } from '../../test-utilities/test-utilities';
import { defineMethod, updateMethod, removeItMethod } from '../base/BaseCollection.methods';

/* eslint prefer-arrow-callback: "off",  no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('EventsDayCollection Meteor Methods', function testSuite() {
    it('Can define, update, and removeIt', async function test1() {
      const { username, password } = await defineTestUser.callPromise();
      await withLoggedInUser({ username, password });
      await withSubscriptions();
      const collectionName = EventsDay.getCollectionName();
      const definitionData = {};
      definitionData.day = faker.lorem.words();
      definitionData.title = faker.lorem.words();
      definitionData.start = faker.lorem.words();
      definitionData.end = faker.lorem.words();
      definitionData.min = faker.datatype.number({
        min: 0,
        max: 720,
      });
      definitionData.type = eventTypes[faker.datatype.number({ min: 0, max: eventTypes.length - 1 })];
      definitionData.ml1 = faker.datatype.number({
        min: 0,
        max: 10,
      });
      definitionData.ml2 = faker.datatype.number({
        min: 0,
        max: 10,
      });
      definitionData.ml3 = faker.datatype.number({
        min: 0,
        max: 10,
      });
      definitionData.section = faker.lorem.words();
      definitionData.remarks = faker.lorem.words();
      definitionData.laneID = faker.lorem.words();
      const docID = await defineMethod.callPromise({ collectionName, definitionData });
      expect(EventsDay.isDefined(docID)).to.be.true;
      let doc = EventsDay.findDoc(docID);
      expect(doc.day).to.equal(definitionData.day);
      expect(doc.title).to.equal(definitionData.title);
      expect(doc.start).to.equal(definitionData.start);
      expect(doc.end).to.equal(definitionData.end);
      expect(doc.min).to.equal(definitionData.min);
      expect(doc.type).to.equal(definitionData.type);
      expect(doc.ml1).to.equal(definitionData.ml1);
      expect(doc.ml2).to.equal(definitionData.ml2);
      expect(doc.ml3).to.equal(definitionData.ml3);
      expect(doc.section).to.equal(definitionData.section);
      expect(doc.remarks).to.equal(definitionData.remarks);
      expect(doc.laneID).to.equal(definitionData.laneID);
      const updateData = {};
      updateData.id = docID;
      updateData.day = faker.lorem.words();
      updateData.title = faker.lorem.words();
      updateData.start = faker.lorem.words();
      updateData.end = faker.lorem.words();
      updateData.min = faker.datatype.number({
        min: 0,
        max: 720,
      });
      updateData.type = eventTypes[faker.datatype.number({ min: 0, max: eventTypes.length - 1 })];
      updateData.ml1 = faker.datatype.number({
        min: 0,
        max: 10,
      });
      updateData.ml2 = faker.datatype.number({
        min: 0,
        max: 10,
      });
      updateData.ml3 = faker.datatype.number({
        min: 0,
        max: 10,
      });
      updateData.section = faker.lorem.words();
      updateData.remarks = faker.lorem.words();
      updateData.laneID = faker.lorem.words();
      await updateMethod.callPromise({ collectionName, updateData });
      doc = EventsDay.findDoc(docID);
      expect(doc.day).to.equal(updateData.day);
      expect(doc.title).to.equal(updateData.title);
      expect(doc.start).to.equal(updateData.start);
      expect(doc.end).to.equal(updateData.end);
      expect(doc.type).to.equal(updateData.type);
      expect(doc.ml1).to.equal(updateData.ml1);
      expect(doc.ml2).to.equal(updateData.ml2);
      expect(doc.ml3).to.equal(updateData.ml3);
      expect(doc.section).to.equal(updateData.section);
      expect(doc.remarks).to.equal(updateData.remarks);
      expect(doc.laneID).to.equal(updateData.laneID);
      await removeItMethod.callPromise({ collectionName, instance: docID });
      expect(EventsDay.isDefined(docID)).to.be.false;
    });
  });
}