import { Meteor } from "meteor/meteor";
import { expect } from "chai";
import faker from "faker";
import fc from "fast-check";
import { Holidays } from "./HolidayCollection";
import { removeAllEntities } from "../base/BaseUtilities";
import { MATPCollections } from "../matp/MATPCollections";
import {
  testDefine,
  testDumpRestore,
  testUpdate,
} from "../utilities/test-helpers";
import { timeoutTypes } from "./TimeoutCollection";

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

    it("Can define and removeIt", function test1(done) {
      fc.assert(
        fc.property(
          fc.lorem({ maxCount: 6 }),
          fc.lorem({ maxCount: 1 }),
          fc.lorem({ maxCount: 1 }),
          fc.integer({ min: 0, max: timeoutTypes.length - 1 }),
          fc.integer({ min: 0, max: 10 }),
          (title, start, end, choice, hours) => {
            const type = timeoutTypes[choice];
            const definitionData = { title, start, end, type, hours };
            testDefine(collection, definitionData);
          }
        )
      );
      done();
    });

    it("Can update", function test3(done) {
      const title = faker.lorem.words();
      const start = faker.lorem.words();
      const end = faker.lorem.words();
      const type =
        timeoutTypes[
          faker.datatype.number({ min: 1, max: timeoutTypes.length - 1 })
        ];
      const hours = faker.datatype.number({
        min: 0,
        max: 10,
      });
      const docID = collection.define({
        title,
        start,
        end,
        type,
        hours,
      });
      fc.assert(
        fc.property(
          fc.lorem({ maxCount: 6 }),
          fc.lorem({ maxCount: 1 }),
          fc.lorem({ maxCount: 1 }),
          fc.integer({ min: 0, max: timeoutTypes.length - 1 }),
          fc.integer({ min: 0, max: 10 }),
          (newTitle, newStart, newEnd, index, newHours) => {
            const updateData = {
              title: newTitle,
              start: newStart,
              end: newEnd,
              type: timeoutTypes[index],
              hours: newHours,
            };
            testUpdate(collection, docID, updateData);
          }
        )
      );
      done();
    });

    it("Can dumpOne, removeIt, and restoreOne", function test4() {
      testDumpRestore(collection);
    });
  });
}
