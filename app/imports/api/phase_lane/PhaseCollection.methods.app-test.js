import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import faker from 'faker';
import { PMIs } from './PMICollection';
import { defineTestUser, withLoggedInUser, withSubscriptions } from '../../test-utilities/test-utilities';
import { defineMethod, updateMethod, removeItMethod } from '../base/BaseCollection.methods';

/* eslint prefer-arrow-callback: "off",  no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('PMICollection Meteor Methods', function testSuite() {
    it('Can define, update, and removeIt', async function test1() {
      const { username, password } = await defineTestUser.callPromise();
      await withLoggedInUser({ username, password });
      await withSubscriptions();
      const collectionName = Stuffs.getCollectionName();
      const definitionData = {};
      definitionData.title = faker.lorem.words();
      definitionData.start = faker.lorem.words();
      definitionData.end = faker.lorem.words();
      definitionData.bgColor = faker.lorem.words();
      definitionData.owner = username;
      const docID = await defineMethod.callPromise({ collectionName, definitionData });
      expect(PMIs.isDefined(docID)).to.be.true;
      let doc = PMIs.findDoc(docID);
      expect(doc.title).to.equal(definitionData.name);
      expect(doc.start).to.equal(definitionData.start);
      expect(doc.end).to.equal(definitionData.end);
      expect(doc.bgColor).to.equal(definitionData.bgColor);
      const updateData = {};
      updateData.id = docID;
      updateData.title = faker.lorem.words();
      updateData.start = faker.lorem.words();
      updateData.end = faker.lorem.words();
      updateData.bgColor = faker.lorem.words();
      await updateMethod.callPromise({ collectionName, updateData });
      doc = Stuffs.findDoc(docID);
      expect(doc.title).to.equal(updateData.name);
      expect(doc.start).to.equal(updateData.name);
      expect(doc.end).to.equal(updateData.name);
      expect(doc.bgColor).to.equal(updateData.name);
      await removeItMethod.callPromise({ collectionName, instance: docID });
      expect(Stuffs.isDefined(docID)).to.be.false;
    });
  });
}
