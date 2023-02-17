import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import faker from 'faker';
import { Holidays } from './HolidayCollection';
import { defineTestUser, withLoggedInUser, withSubscriptions } from '../../test-utilities/test-utilities';
import { defineMethod, updateMethod, removeItMethod } from '../base/BaseCollection.methods';

/* eslint prefer-arrow-callback: "off",  no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('HolidayCollection Meteor Methods', function testSuite() {
    it('Can define, update, and removeIt', async function test1() {
      const { username, password } = await defineTestUser.callPromise();
      await withLoggedInUser({ username, password });
      await withSubscriptions();
      const collectionName = Holidays.getCollectionName();
      const definitionData = {};
      definitionData.holidayName = faker.lorem.words();
      definitionData.date = faker.lorem.words();
      definitionData.owner = username;
   
      const docID = await defineMethod.callPromise({ collectionName, definitionData });
      expect(Holidays.isDefined(docID)).to.be.true;
      let doc = Holidays.findDoc(docID);
      expect(doc.holidayName).to.equal(definitionData.holidayName);
      expect(doc.date).to.equal(definitionData.date);
      const updateData = {};
      updateData.id = docID;
      updateData.holidayName = faker.lorem.words();
      updateData.date = faker.lorem.words();

      await updateMethod.callPromise({ collectionName, updateData });
      doc = Holidays.findDoc(docID);
      expect(doc.holidayName).to.equal(updateData.holidayName);
      expect(doc.date).to.equal(updateData.date);
      await removeItMethod.callPromise({ collectionName, instance: docID });
      expect(Holidays.isDefined(docID)).to.be.false;
    });
  });
}
