import React from "react";
import ListEventAccordion from "../pages/ListEventAccordion";
import EditPhaseLane from "../pages/EditPhaseLane";
import CalendarPhaseItem from "./CalendarPhaseItem";
import { AirplaneFill } from "react-bootstrap-icons";
import { Col, Container, Row } from "react-bootstrap";

const textColor = { color: "#ebe9e6" };

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
const PhaseLaneItem = ({ phase, eventsDay }) => (
  <Container
    className="container-phase-item"
    style={{ backgroundColor: phase.color, padding: "20px" }}
  >
    <Row>
      <Col xs={8}>
        <h6 style={textColor}>{phase.issue} PHASE LANE</h6>
      </Col>{" "}
      <Col xs={2}>
        <CalendarPhaseItem key={phase._id} phase={phase} events={eventsDay} />
      </Col>
      <Col xs={2} style={{ marginLeft: -14 }}>
        <EditPhaseLane key={phase._id} phase={phase} />
      </Col>
    </Row>
    <p style={textColor}>
      <AirplaneFill style={{ transform: "rotate(90deg)" }} /> {phase.name} (
      {phase.author})
    </p>
    <ListEventAccordion laneID={phase} eventsDay={eventsDay} />
  </Container>
);

export default PhaseLaneItem;
