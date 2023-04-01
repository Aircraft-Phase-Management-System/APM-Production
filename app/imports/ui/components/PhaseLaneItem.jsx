import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Col,
  Container,
  Row
} from "react-bootstrap";
import EditPhaseLane from "../pages/EditPhaseLane";
import { AirplaneFill } from "react-bootstrap-icons";
import ListEvent from "./ListEvent";

const textColor = { color: '#ebe9e6' } ;

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
const PhaseLaneItem = ({ phase, eventsDay }) => (
  <Container className="container-phase-item" style={{ backgroundColor: phase.color, padding: '20px' }}>
      <Row>
        <Col><h6 style={textColor}>{phase.issue} PHASE LANES</h6></Col>{" "}
        <Col xs={2}>
          <EditPhaseLane key={phase._id} phase={phase}/>
        </Col>
      </Row>
      <p style={textColor}><AirplaneFill style={{ transform: "rotate(90deg)" }} /> {phase.name} ({phase.author})</p>
    <ListEvent laneID={phase.issue} eventsDay={eventsDay}/>
  </Container>
);

export default PhaseLaneItem;
