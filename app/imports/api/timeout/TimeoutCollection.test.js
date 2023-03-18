import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import faker from 'faker';
import fc from 'fast-check';
import { Holidays } from './HolidayCollection';
import { removeAllEntities } from '../base/BaseUtilities';
import { MATPCollections } from '../matp/MATPCollections';
import { testDefine, testDumpRestore, testUpdate } from '../utilities/test-helpers';

/* eslint prefer-arrow-callback: "off",  no-unused-expressions: "off" */
/* eslint-env mocha */

const collectionName = Holidays.getCollectionName();

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
          fc.lorem({ maxCount: 4 }),
          fc.lorem({ maxCount: 1 }),
          fc.lorem({ maxCount: 1 }),
          (name, date, owner) => {
            const definitionData = { holidayName, date, owner };
            testDefine(collection, definitionData);
          },
        ),
      );
      done();
    });

    it('Can define duplicates', function test2() {
      const holidayName = faker.animal.dog();
      const date = faker.animal.dog();
      const owner = faker.internet.email();
      const docID1 = collection.define({ holidayName, date, owner });
      const docID2 = collection.define({ holidayName, date, owner });
      expect(docID1).to.not.equal(docID2);
    });

    it('Can update', function test3(done) {
      const holidayName = faker.lorem.words();
      const date = faker.lorem.words();
      const owner = faker.lorem.words();
      const docID = collection.define({
        holidayName,
        date,
        owner,
      });
      // console.log(collection.findDoc(docID));
      fc.assert(
        fc.property(
          fc.lorem({ maxCount: 2 }),
          fc.integer({ max: 10 }),
          (newholidayName, newDate) => {
            // console.log('update', index, stuffConditions[index]);
            const updateData = { holidayName: newholidayName, date: newDate };
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
