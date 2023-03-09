import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { _ } from 'meteor/underscore';
import { Roles } from 'meteor/alanning:roles';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const holidayPublications = {
  holiday: 'Holiday',
  holidayAdmin: 'HolidayAdmin',
};

class HolidayCollection extends BaseCollection {
  constructor() {
    super('Holidays', new SimpleSchema({
      title: String,
      start: Date,
      owner: String,
      type: String,
    }));
  }

  /**
   * Defines a new Holiday item.
   * @param title the name of the item.
   * @param start how many.
   * @param owner the owner of the item.
   * @param type the type of the item
   * @return {String} the docID of the new document.
   */
  define({ title, start, owner, type }) {
    const docID = this._collection.insert({
      title,
      start,
      owner,
      type,
    });
    return docID;
  }

  /**
   * Upstarts the given document.
   * @param docID the id of the document to upstart.
   * @param title the new name (optional).
   * @param quantity the new quantity (optional).
   * @param condition the new condition (optional).
   */
  update(docID, { title, start }) {
    const updateData = {};
    if (title) {
      updateData.title = title;
    }

    if (start) {
      updateData.start = start;
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
      Meteor.publish(holidayPublications.holiday, function publish() {
        if (this.userId) {
          const username = Meteor.users.findOne(this.userId).username;
          return instance._collection.find({ owner: username });
        }
        return this.ready();
      });

      /** This subscription publishes all documents regardless of user, but only if the logged in user is the Admin. */
      Meteor.publish(holidayPublications.holidayAdmin, function publish() {
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
  subscribeHoliday() {
    if (Meteor.isClient) {
      return Meteor.subscribe(holidayPublications.holiday);
    }
    return null;
  }

  /**
   * Subscription method for admin users.
   * It subscribes to the entire collection.
   */
  subscribeHolidayAdmin() {
    if (Meteor.isClient) {
      return Meteor.subscribe(holidayPublications.holidayAdmin);
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
    const title = doc.title;
    const start = doc.start;
    const owner = doc.owner;
    return { title, start, owner };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Holidays = new HolidayCollection();
