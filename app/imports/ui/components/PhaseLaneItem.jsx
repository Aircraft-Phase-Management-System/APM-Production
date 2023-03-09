import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Col,
  Container,
  Row,
  Table,
  Button,
  Modal,
  Card,
} from "react-bootstrap";
// import { Link } from "react-router-dom";
// import { COMPONENT_IDS } from "../utilities/ComponentIDs";
import EditPhaseLane from "../pages/EditPhaseLane";
import { AirplaneFill } from "react-bootstrap-icons";

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
const PhaseLaneItem = ({ phase }) => (
  <Card style={{ backgroundColor: phase.color }}>
    <Card.Header>
      <Row>
        <Col>{phase.issue} PHASE LANE</Col>{" "}
        <Col xs={2}>
          <EditPhaseLane key={phase._id} phase={phase} />
        </Col>
      </Row>
    </Card.Header>
    <Card.Body>
      <Card.Title as="h6">
        <AirplaneFill style={{ transform: "rotate(90deg)" }} /> {phase.name}
      </Card.Title>
      <Card.Subtitle className="mb-2 text-muted">{phase.author}</Card.Subtitle>
    </Card.Body>
  </Card>
);

// Require a document to be passed to this component.
/*HolidayItem.propTypes = {
  holiday: PropTypes.shape({
    title: PropTypes.string,
    start: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};*/

export default PhaseLaneItem;
