import React, { useState } from "react";
import {
  Col,
  Container,
  Row,
  Button,
  Form,
  Card,
  Table,
  Accordion,
  ProgressBar,
} from "react-bootstrap";
import { CalendarRange, PencilSquare, Trash } from "react-bootstrap-icons";
import { Events } from "../../api/event_phase/EventCollection";
import { removeItMethod } from "../../api/base/BaseCollection.methods";
import { useTracker } from "meteor/react-meteor-data";
import LoadingSpinner from "../components/LoadingSpinner";
import React from "react";
import { Col, Row, Button } from "react-bootstrap";
import { PencilSquare, Trash } from "react-bootstrap-icons";




const EventItem = ({ event }) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { doc, ready } = useTracker(() => {
    // Get access to Holiday documents.
    const subscription = Events.subscribeEvent();
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the document
    const document = Events.findDoc(event._id);
    return {
      doc: document,
      ready: rdy,
    };
  }, [event._id]);

  const handleDelete = () => {
    const collectionName = Events.getCollectionName();
    const owner = Meteor.user().username;
    const instance = Events.findDoc(event._id);
    console.log(event._id)
    console.log(instance)
    removeItMethod
      .callPromise({ collectionName, instance })
      .catch((error) => swal("Error", error.message, "error"))
      .then(() => {
        swal("Success", "Event deleted successfully", "success");
      });
    event._id.event.remove();
    timeouts.removeIt(event._id.event.title);
      
  };


  return ready ? (
  <>
    <br />
    <Row>
      <Col md={2}>
        <Row>Title:</Row>
        <Row>Start:</Row>
        <Row>End:</Row>
        <Row>Days:</Row>
      </Col>
      <Col md={8}>
        <Row>{event.title}</Row>
        <Row>{event.start.substring(0, 10)}</Row>
        <Row>{event.end.substring(0, 10)}</Row>
        <Row>{event.days}</Row>
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
  ) : (
    <LoadingSpinner />
  );
};


export default EventItem;