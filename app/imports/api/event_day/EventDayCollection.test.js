import { Meteor } from "meteor/meteor";
import { expect } from "chai";
import faker from "faker";
import fc from "fast-check";
import { EventsDay, eventTypes } from "./EventDayCollection";
import { removeAllEntities } from "../base/BaseUtilities";
import { MATPCollections } from "../matp/MATPCollections";
import {
  testDefine,
  testDumpRestore,
  testUpdate,
} from "../utilities/test-helpers";

/* eslint prefer-arrow-callback: "off",  no-unused-expressions: "off" */
/* eslint-env mocha */

const collectionName = EventsDay.getCollectionName();

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
          fc.lorem({ maxCount: 1 }),
          fc.lorem({ maxCount: 10 }),
          fc.lorem({ maxCount: 1 }),
          fc.lorem({ maxCount: 1 }),
          fc.integer({ min: 0, max: 720 }),
          fc.integer({ min: 0, max: eventTypes.length - 1 }),
          fc.integer({ min: 0, max: 10 }),
          fc.integer({ min: 0, max: 10 }),
          fc.integer({ min: 0, max: 10 }),
          fc.lorem({ maxCount: 1 }),
          fc.lorem({ maxCount: 80 }),
          fc.lorem({ maxCount: 1 }),
          (
            day,
            title,
            start,
            end,
            min,
            choice,
            ml1,
            ml2,
            ml3,
            section,
            remarks,
            laneID
          ) => {
            const type = eventTypes[choice];
            const definitionData = {
              day,
              title,
              start,
              end,
              min,
              type,
              ml1,
              ml2,
              ml3,
              section,
              remarks,
              laneID,
            };
            testDefine(collection, definitionData);
          }
        )
      );
      done();
    });

    it("Can define duplicates", function test2() {
      const day = faker.animal.dog();
      const title = faker.animal.dog();
      const start = faker.animal.dog();
      const end = faker.animal.dog();
      const min = faker.datatype.number({ min: 0, max: 720 });
      const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const ml1 = faker.datatype.number({ min: 0, max: 10 });
      const ml2 = faker.datatype.number({ min: 0, max: 10 });
      const ml3 = faker.datatype.number({ min: 0, max: 10 });
      const section = faker.animal.dog();
      const remarks = faker.animal.dog();
      const laneID = faker.animal.dog();
      const docID1 = collection.define({
        day,
        title,
        start,
        end,
        min,
        type,
        ml1,
        ml2,
        ml3,
        section,
        remarks,
        laneID,
      });
      const docID2 = collection.define({
        day,
        title,
        start,
        end,
        min,
        type,
        ml1,
        ml2,
        ml3,
        section,
        remarks,
        laneID,
      });
      expect(docID1).to.not.equal(docID2);
    });

    it("Can update", function test3(done) {
      const name = faker.lorem.words();
      const day = faker.lorem.words();
      const title = faker.lorem.words();
      const start = faker.lorem.words();
      const end = faker.lorem.words();
      const min = faker.datatype.number({ min: 0, max: 720 });
      const type =
        eventTypes[
          faker.datatype.number({ min: 1, max: eventTypes.length - 1 })
        ];
      const ml1 = faker.datatype.number({ min: 0, max: 10 });
      const ml2 = faker.datatype.number({ min: 0, max: 10 });
      const ml3 = faker.datatype.number({ min: 0, max: 10 });
      const section = faker.lorem.words();
      const remarks = faker.lorem.words();
      const docID = collection.define({
        day,
        title,
        start,
        end,
        min,
        type,
        ml1,
        ml2,
        ml3,
        section,
        remarks,
      });
      fc.assert(
        fc.property(
          fc.lorem({ maxCount: 1 }),
          fc.lorem({ maxCount: 10 }),
          fc.lorem({ maxCount: 1 }),
          fc.lorem({ maxCount: 1 }),
          fc.integer({ min: 0, max: 720 }),
          fc.integer({ min: 0, max: eventTypes.length - 1 }),
          fc.integer({ min: 0, max: 10 }),
          fc.integer({ min: 0, max: 10 }),
          fc.integer({ min: 0, max: 10 }),
          fc.lorem({ maxCount: 1 }),
          fc.lorem({ maxCount: 80 }),
          (
            newDay,
            newTitle,
            newStart,
            newEnd,
            newMin,
            index,
            newMl1,
            newMl2,
            newMl3,
            newSection,
            newRemarks
          ) => {
            const updateData = {
              day: newDay,
              title: newTitle,
              start: newStart,
              end: newEnd,
              min: newMin,
              type: eventTypes[index],
              ml1: newMl1,
              ml2: newMl2,
              ml3: newMl3,
              section: newSection,
              remarks: newRemarks,
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
