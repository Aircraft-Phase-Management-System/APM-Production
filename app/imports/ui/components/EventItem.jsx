import React from "react";
import { Col, Row, Button } from "react-bootstrap";
import { PencilSquare, Trash } from "react-bootstrap-icons";

const EventItem = ({ event }) => (
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
      <Button variant="primary" size="sm">
        <PencilSquare />{" "}
        Edit
      </Button>
      <Button variant="danger" size="sm">
        <Trash />{" "}
        Delete
      </Button>
    </div>
    <hr />
  </>
);

export default EventItem;
