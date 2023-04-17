import React from "react";
import { Col, Row, Button } from "react-bootstrap";
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

  console.log(event);

  return (
    <>
      <br />
      <Row>
        <Col md={3}>
          <Row>
            <p>Date:</p>
          </Row>
          <Row>
            <p>Title:</p>
          </Row>
          <Row>
            <p>Start:</p>
          </Row>
          <Row>
            <p>End:</p>
          </Row>
          <Row>
            <p>Time:</p>
          </Row>
          <Row>
            <p>Type:</p>
          </Row>
          <Row>
            <p>ML1:</p>
          </Row>
          <Row>
            <p>ML2:</p>
          </Row>
          <Row>
            <p>ML3:</p>
          </Row>
        </Col>
        <Col md={8}>
          <Row>
            <p>{event.day}</p>
          </Row>
          <Row>
            <p>{event.title}</p>
          </Row>
          <Row>
            <p>{event.start}</p>
          </Row>
          <Row>
            <p>{event.end}</p>
          </Row>
          <Row>
            <p>{event.min}</p>
          </Row>
          <Row>
            <p>{event.type}</p>
          </Row>
          <Row>
            <p>{event.ml1}</p>
          </Row>
          <Row>
            <p>{event.ml2}</p>
          </Row>
          <Row>
            <p>{event.ml3}</p>
          </Row>
        </Col>
      </Row>

      <br />
      <div className="d-grid gap-2">
        <Button variant="primary" size="sm">
          <PencilSquare /> Edit
        </Button>
        <Button variant="danger" size="sm" onClick={handleDelete}>
          <Trash /> Delete
        </Button>
      </div>
      <hr />
    </>
  );
};

export default EventSameDayItem;
