import { Meteor } from 'meteor/meteor';
import faker from 'faker';
import fc from 'fast-check';
import { Phases } from './PhaseCollection';
import { removeAllEntities } from '../base/BaseUtilities';
import { MATPCollections } from '../matp/MATPCollections';
import { testDefine, testDumpRestore, testUpdate } from '../utilities/test-helpers';

/* eslint prefer-arrow-callback: "off",  no-unused-expressions: "off" */
/* eslint-env mocha */

const collectionName = Phases.getCollectionName();

if (Meteor.isServer) {
  describe(collectionName, function testSuite() {
    const collection = MATPCollections.getCollection(collectionName);

    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('Can define and removeIt', function test1(done) {
      fc.assert(
        fc.property(
          fc.lorem({ maxCount: 10 }),
          fc.lorem({ maxCount: 4 }),
          fc.lorem({ maxCount: 1 }),
          fc.lorem({ maxCount: 1 }),
          (name, author, color, issue) => {
            const definitionData = { name, author, color, issue };
            testDefine(collection, definitionData);
          },
        ),
      );
      done();
    });

    it('Can update', function test3(done) {
      const name = faker.lorem.words();
      const author = faker.lorem.words();
      const color = faker.lorem.words();
      const issue = faker.lorem.words();
      const docID = collection.define({
        name,
        author,
        color,
        issue,
      });
      fc.assert(
        fc.property(
          fc.lorem({ maxCount: 2 }),
          fc.integer({ max: 10 }),
          fc.integer({ min: 0, max: stuffConditions.length - 1 }),
          (newName, newAuthor, newIssue) => {
            // console.log('update', index, stuffConditions[index]);
            const updateData = { name: newName, author: newAuthor, issue: newIssue };
            testUpdate(collection, docID, updateData);
          },
        ),
      );
      done();
    });

    it('Can dumpOne, removeIt, and restoreOne', function test4() {
      testDumpRestore(collection);
    });
  });
}
