import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Col,
  Container,
  Row
} from "react-bootstrap";
// import { Link } from "react-router-dom";
// import { COMPONENT_IDS } from "../utilities/ComponentIDs";
import EditPhaseLane from "../pages/EditPhaseLane";
import { AirplaneFill } from "react-bootstrap-icons";
import ListEvent from "../pages/ListEvent";

const textColor = { color: '#ebe9e6' } ;

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
const PhaseLaneItem = ({ phase }) => (
  <Container className="container-phase-item" style={{ backgroundColor: phase.color, padding: '20px' }}>
      <Row>
        <Col><h6 style={textColor}>{phase.issue} PHASE LANE</h6></Col>{" "}
        <Col xs={2}>
          <EditPhaseLane key={phase._id} phase={phase}/>
        </Col>
      </Row>
      <p style={textColor}><AirplaneFill style={{ transform: "rotate(90deg)" }} /> {phase.name} ({phase.author})</p>
    <ListEvent/>
  </Container>
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
