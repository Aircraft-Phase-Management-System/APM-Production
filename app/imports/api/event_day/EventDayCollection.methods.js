import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import faker from 'faker';
import { EventDay } from './EventDayCollection';
import { defineTestUser, withLoggedInUser, withSubscriptions } from '../../test-utilities/test-utilities';
import { defineMethod, updateMethod, removeItMethod } from '../base/BaseCollection.methods';

/* eslint prefer-arrow-callback: "off",  no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('EventDayCollection Meteor Methods', function testSuite() {
    it('Can define, update, and removeIt', async function test1() {
      const { username, password } = await defineTestUser.callPromise();
      await withLoggedInUser({ username, password });
      await withSubscriptions();
      const collectionName = EventDay.getCollectionName();
      const definitionData = {};
      definitionData.title = faker.lorem.words();
      definitionData.day = faker.lorem.words();
      definitionData.owner = username;
   
      const docID = await defineMethod.callPromise({ collectionName, definitionData });
      expect(EventDay.isDefined(docID)).to.be.true;
      let doc = EventDay.findDoc(docID);
      expect(doc.title).to.equal(definitionData.title);
      expect(doc.date).to.equal(definitionData.date);
      const updateData = {};
      updateData.id = docID;
      updateData.title = faker.lorem.words();
      updateData.day = faker.lorem.words();

      await updateMethod.callPromise({ collectionName, updateData });
      doc = EventDay.findDoc(docID);
      expect(doc.title).to.equal(updateData.title);
      expect(doc.day).to.equal(updateData.day);
      await removeItMethod.callPromise({ collectionName, instance: docID });
      expect(EventDay.isDefined(docID)).to.be.false;
    });
  });
}
