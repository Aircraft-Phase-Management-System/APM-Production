import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import faker from 'faker';
import { Phases } from './PhaseCollection';
import { defineTestUser, withLoggedInUser, withSubscriptions } from '../../test-utilities/test-utilities';
import { defineMethod, updateMethod, removeItMethod } from '../base/BaseCollection.methods';

/* eslint prefer-arrow-callback: "off",  no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('PhaseCollection Meteor Methods', function testSuite() {
    it('Can define, update, and removeIt', async function test1() {
      const { username, password } = await defineTestUser.callPromise();
      await withLoggedInUser({ username, password });
      await withSubscriptions();
      const collectionName = Phases.getCollectionName();
      const definitionData = {};
      definitionData.name = faker.lorem.words();
      definitionData.author = faker.lorem.words();
      definitionData.color = faker.lorem.words();
      definitionData.issue = faker.lorem.words();
      const docID = await defineMethod.callPromise({ collectionName, definitionData });
      expect(Phases.isDefined(docID)).to.be.true;
      let doc = Phases.findDoc(docID);
      expect(doc.name).to.equal(definitionData.name);
      expect(doc.author).to.equal(definitionData.author);
      expect(doc.color).to.equal(definitionData.color);
      expect(doc.issue).to.equal(definitionData.issue);
      const updateData = {};
      updateData.id = docID;
      updateData.name = faker.lorem.words();
      updateData.author = faker.lorem.words();
      updateData.color = faker.lorem.words();
      updateData.issue = faker.lorem.words();
      await updateMethod.callPromise({ collectionName, updateData });
      doc = Phases.findDoc(docID);
      expect(doc.name).to.equal(updateData.name);
      expect(doc.author).to.equal(updateData.author);
      expect(doc.color).to.equal(updateData.color);
      expect(doc.issue).to.equal(updateData.issue);
      await removeItMethod.callPromise({ collectionName, instance: docID });
      expect(Phases.isDefined(docID)).to.be.false;
    });
  });
}