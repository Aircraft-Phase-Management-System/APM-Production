import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import faker from 'faker';
import { Timeouts, timeoutTypes } from './TimeoutCollection';
import { defineTestUser, withLoggedInUser, withSubscriptions } from '../../test-utilities/test-utilities';
import { defineMethod, updateMethod, removeItMethod } from '../base/BaseCollection.methods';

/* eslint prefer-arrow-callback: "off",  no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('TimeoutCollection Meteor Methods', function testSuite() {
    it('Can define, update, and removeIt', async function test1() {
      const { username, password } = await defineTestUser.callPromise();
      await withLoggedInUser({ username, password });
      await withSubscriptions();
      const collectionName = Timeouts.getCollectionName();
      const definitionData = {};
      definitionData.title = faker.lorem.words();
      definitionData.start = faker.lorem.words();
      definitionData.end = faker.lorem.words();
      definitionData.type = timeoutTypes[faker.datatype.number({ min: 0, max: timeoutTypes.length - 1 })];
      definitionData.hours = faker.datatype.number({
        min: 0,
        max: 10,
      });
      const docID = await defineMethod.callPromise({ collectionName, definitionData });
      expect(Timeouts.isDefined(docID)).to.be.true;
      let doc = Timeouts.findDoc(docID);
      expect(doc.title).to.equal(definitionData.title);
      expect(doc.start).to.equal(definitionData.start);
      expect(doc.end).to.equal(definitionData.end);
      expect(doc.type).to.equal(definitionData.type);
      expect(doc.hours).to.equal(definitionData.hours);
      const updateData = {};
      updateData.id = docID;
      updateData.title = faker.lorem.words();
      updateData.start = faker.lorem.words();
      updateData.end = faker.lorem.words();
      updateData.tyle = timeoutTypes[faker.datatype.number({ min: 0, max: timeoutTypes.length - 1 })];
      updateData.hours = faker.datatype.number({
        min: 0,
        max: 10,
      });
      await updateMethod.callPromise({ collectionName, updateData });
      doc = Timeouts.findDoc(docID);
      expect(doc.title).to.equal(updateData.title);
      expect(doc.start).to.equal(updateData.start);
      expect(doc.end).to.equal(updateData.end);
      expect(doc.type).to.equal(updateData.type);
      expect(doc.hours).to.equal(updateData.hours);
      await removeItMethod.callPromise({ collectionName, instance: docID });
      expect(Timeouts.isDefined(docID)).to.be.false;
    });
  });
}
