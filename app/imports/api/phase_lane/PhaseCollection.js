import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { _ } from 'meteor/underscore';
import { Roles } from 'meteor/alanning:roles';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const phasePublications = {
  phase: 'Phase',
  phaseAdmin: 'PhaseAdmin',
};

class PhaseCollection extends BaseCollection {
  constructor() {
    super('Phases', new SimpleSchema({
      name: String,
      author: String,
      color: {
        type: String,
        allowedValues: ["#3788d8", "#87aef5"],
        defaultValue: "#87aef5",
      },
      issue: String,
      owner: String,
    }));
  }

    /**
   * Defines a new Stuff item.
   * @param name the name of the item.
   * @param author how many.
   * @param color the owner of the item.
   * @param issue the condition of the item.
   * @return {String} the docID of the new document.
   */
  define({ name, author, color, issue, owner }) {
    const docID = this._collection.insert({
      name,
      author, 
      color,
      issue,
      owner,
    });
    return docID;
  }

  /**
   * Updates the given document.
   * @param docID the id of the document to update.
   * @param name the new name (optional).
   * @param author the new quantity (optional).
   * @param color the new condition (optional).
   * @param issue the new condition (optional).
   */
  update(docID, { name, author, color, issue }) {
    const updateData = {};
    if (name) {
      updateData.name = name;
    }
    if (author) {
      updateData.author = author;
    }
    if (color) {
      updateData.color = color;
    }
    if (issue) {
      updateData.issue = issue;
    }
    this._collection.update(docID, { $set: updateData });
  }

  /**
   * A stricter form of remove that throws an error if the document or docID could not be found in this collection.
   * @param { String | Object } name A document or docID in this collection.
   * @returns true
   */
  removeIt(name) {
    const doc = this.findDoc(name);
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
      Meteor.publish(phasePublications.phase, function publish() {
        if (this.userId) {
          const username = Meteor.users.findOne(this.userId).username;
          return instance._collection.find({ owner: username });
        }
        return this.ready();
      });

      /** This subscription publishes all documents regardless of user, but only if the logged in user is the Admin. */
      Meteor.publish(phasePublications.phaseAdmin, function publish() {
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
  subscribePhase() {
    if (Meteor.isClient) {
      return Meteor.subscribe(phasePublications.phase);
    }
    return null;
  }

  /**
   * Subscription method for admin users.
   * It subscribes to the entire collection.
   */
  subscribePhaseAdmin() {
    if (Meteor.isClient) {
      return Meteor.subscribe(phasePublications.phaseAdmin);
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
    const name = doc.name;
    const author = doc.author;
    const color = doc.color;
    const issue = doc.issue;
    const owner = doc.owner;
    return { name, author, color, issue, owner };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Phases = new PhaseCollection();
