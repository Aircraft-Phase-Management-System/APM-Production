import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { _ } from 'meteor/underscore';
import { Roles } from 'meteor/alanning:roles';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const eventDayPublications = {
  eventDay: 'EventsDay',
  eventDayAdmin: 'EventsDayAdmin',
};

class EventDayCollection extends BaseCollection {
  constructor() {
    super('EventsDay', new SimpleSchema({
      day: {type: String, optional: true },
      title: {type: String, optional: true },
      start: {type: String, optional: true },
      end: {type: String, optional: true },
      min: {type: Number, optional: true },
      type: {
        type: String,
        allowedValues: ['Planned', 'Unexpected', 'Plan Incurred'],
        defaultValue: 'Planned',
      },
      ml1: {type: Number, optional: true },
      ml2: {type: Number, optional: true },
      ml3: {type: Number, optional: true },
      section: {type: String, optional: true },
      remarks: {type: String, optional: true },
    }));
  }


    /**
   * Defines a new Event Day item.
   * @param day the name of the item.
   * @param title the name of the item.
   * @param start how many.
   * @param end the owner of the item.
   * @param color the condition of the item.
   * @return {String} the docID of the new document.
   */
  define({ day, title, start, end, min, type, ml1, ml2, ml3, section, remarks }) {
    Meteor.users.allow({
      insert: function (userId, doc) {
             //Normally I would check if (this.userId) to see if the method is called by logged in user or guest
             //you can also add some checks here like user role based check etc.,
             return true;
      },
      update: function (userId, doc, fieldNames, modifier) {
             //similar checks like insert
             return true;
      },
      remove: function (userId, doc) {
             //similar checks like insert
             return true;
      }
  });
    const docID = this._collection.insert({
      day, title, start, end, min, type, ml1, ml2, ml3, section, remarks,
    });
    return docID;
  }

  /**
   * Updates the given document.
   * @param docID the id of the document to update.
   * @param title the new name (optional).
   * @param start the new quantity (optional).
   * @param end the new condition (optional).
   * @param color the new condition (optional).
   */
  update(docID, { day, title, start, end, min, type, ml1, ml2, ml3, section, remarks }) {
    const updateData = {};
    if (day) {
      updateData.day = day;
    }
    if (title) {
      updateData.title = title;
    }
    if (start) {
      updateData.start = start;
    }
    if (end) {
      updateData.end = end;
    }
    // if (quantity) { NOTE: 0 is falsy so we need to check if the quantity is a number.
    if (_.isNumber(min)) {
      updateData.min = min;
    }
    if (type) {
      updateData.type = type;
    }
    // if (quantity) { NOTE: 0 is falsy so we need to check if the quantity is a number.
    if (_.isNumber(ml1)) {
      updateData.ml1 = ml1;
    }
    // if (quantity) { NOTE: 0 is falsy so we need to check if the quantity is a number.
    if (_.isNumber(ml2)) {
      updateData.ml2 = ml2;
    }
    // if (quantity) { NOTE: 0 is falsy so we need to check if the quantity is a number.
    if (_.isNumber(ml3)) {
      updateData.ml3 = ml3;
    }
    if (section) {
      updateData.section = section;
    }
    if (remarks) {
      updateData.remarks = remarks;
    }
    this._collection.update(docID, { $set: updateData });
  }

  /**
   * A stricter form of remove that throws an error if the document or docID could not be found in this collection.
   * @param { String | Object } name A document or docID in this collection.
   * @returns true
   */
  removeIt(title) {
    const doc = this.findDoc(title);
    check(doc, Object);
    this._collection.remove(doc._id);
    return true;
  }


  
  /**
   * Default publication method for entities.
   * It publishes the entire collection for admin and just the stuff associated to an owner.
   */
  publish() {
    if (Meteor.isServer) {
      // get the StuffCollection instance.
      const instance = this;
      /** This subscription publishes only the documents associated with the logged in user */
      Meteor.publish(eventDayPublications.eventDay, function publish() {
        if (this.userId) {
          /*const username = Meteor.users.findOne(this.userId).username;
          return instance._collection.find({ owner: username });*/
          return instance._collection.find();
        }
        return this.ready();
      });

      

      /** This subscription publishes all documents regardless of user, but only if the logged in user is the Admin. */
      Meteor.publish(eventDayPublications.eventDayAdmin, function publish() {
        if (this.userId && Roles.userIsInRole(this.userId, ROLE.ADMIN)) {
          return instance._collection.find();
        }
        return this.ready();
      });
    }
  }

  /**
   * Subscription method for holiday owned by the current user.
   */
  subscribeEventDay() {
    if (Meteor.isClient) {
      return Meteor.subscribe(eventDayPublications.eventDay);
    }
    return null;
  }

  /**
   * Subscription method for admin users.
   * It subscribes to the entire collection.
   */
  subscribeEventDayAdmin() {
    if (Meteor.isClient) {
      return Meteor.subscribe(eventDayPublications.eventDayAdmin);
    }
    return null;
  }

  /**
   * Default implementation of assertValidRoleForMethod. Asserts that userId is logged in as an Admin or User.
   * This is used in the define, update, and removeIt Meteor methods associated with each class.
   * @param userId The userId of the logged in user. Can be null or undefined
   * @throws { Meteor.Error } If there is no logged in user, or the user is not an Admin or User.
   */
  assertValidRoleForMethod(userId) {
    this.assertRole(userId, [ROLE.ADMIN, ROLE.USER]);
  }

  /**
   * Returns an object representing the definition of docID in a format appropriate to the restoreOne or define function.
   * @param docID
   * @return {{owner: (*|number), condition: *, quantity: *, name}}
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const day = doc.day;
    const title = doc.title;
    const start = doc.start;
    const end = doc.start;
    const min = doc.min;
    const type = doc.type;
    const ml1 = doc.ml1;
    const ml2 = doc.ml2;
    const ml3 = doc.ml3;
    const section = doc.section;
    const remarks = doc.remarks;
    /*const color = doc.start;
    const laneID = doc.laneID;
    const owner = doc.owner;*/
    return { day, title, start, end, min, type, ml1, ml2, ml3, section, remarks/*, color, laneID, owner*/ };
  }

  
}


/**
 * Provides the singleton instance of this class to all other entities.
 */
export const EventsDay = new EventDayCollection();
