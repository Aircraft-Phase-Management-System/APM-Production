import React, { useState } from "react";
import {
  Col,
  Row,
  Button,
} from "react-bootstrap";
import { PencilSquare, Trash } from "react-bootstrap-icons";
import { EventsDay } from "../../api/event_day/EventDayCollection";
import { removeItMethod } from "../../api/base/BaseCollection.methods";

const EventSameDayItem = ({ event }) => {

  const handleDelete = () => {
    const collectionName = EventsDay.getCollectionName();
    const owner = Meteor.user().username;
    const instance = EventsDay.findDoc(event._id);
    removeItMethod
      .callPromise({ collectionName, instance })
      .catch((error) => swal("Error", error.message, "error"))
      .then(() => {
        swal("Success", "Event deleted successfully", "success");
      });
    event._id.event.remove();
    timeouts.removeIt(event._id.event.title);
      
  };

  return (
  <>
    <br />
    <Row>
      <Col md={3}>
        <Row>Date:</Row>
        <Row>Title:</Row>
        <Row>Start:</Row>
        <Row>End:</Row>
        <Row>Time:</Row>
        <Row>Type:</Row>
        <Row>ML1:</Row>
        <Row>ML2:</Row>
        <Row>ML3:</Row>
      </Col>
      <Col md={8}>
        <Row>{event.day}</Row>
        <Row>{event.title}</Row>
        <Row>{event.start}</Row>
        <Row>{event.end}</Row>
        <Row>{event.min}</Row>
        <Row>{event.type}</Row>
        <Row>{event.ml1}</Row>
        <Row>{event.ml2}</Row>
        <Row>{event.ml3}</Row>
      </Col>
    </Row>

    <br />
    <div className="d-grid gap-2">
      <Button variant="primary" size="sm" >
        <PencilSquare />{" "}
        Edit
      </Button>
      <Button variant="danger" size="sm" onClick={handleDelete}>
        <Trash />{" "}
        Delete
      </Button>
    </div>
    <hr />
  </>
  )
};

export default EventSameDayItem;