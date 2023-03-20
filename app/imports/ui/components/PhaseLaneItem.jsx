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

/* Function to lighten or darken the color of the card header based on the lane background color. */
/*const newShade = (hexColor, magnitude) => {
  hexColor = hexColor.replace(`#`, ``);
  if (hexColor.length === 6) {
      const decimalColor = parseInt(hexColor, 16);
      let r = (decimalColor >> 16) + magnitude;
      r > 255 && (r = 255);
      r < 0 && (r = 0);
      let g = (decimalColor & 0x0000ff) + magnitude;
      g > 255 && (g = 255);
      g < 0 && (g = 0);
      let b = ((decimalColor >> 8) & 0x00ff) + magnitude;
      b > 255 && (b = 255);
      b < 0 && (b = 0);
      return `#${(g | (b << 8) | (r << 16)).toString(16)}`;
  } else {
      return hexColor;
  }
};*/

const textColor = { color: '#ebe9e6' } ;

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
const PhaseLaneItem = ({ phase }) => (
  <Card style={{ backgroundColor: phase.color }}>
    <Card.Header >
      <Row>
        <Col><p style={textColor}>{phase.issue} PHASE LANE</p></Col>{" "}
        <Col xs={2}>
          <EditPhaseLane key={phase._id} phase={phase}/>
        </Col>
      </Row>
    </Card.Header>
    <Card.Body>
      <Card.Title style={textColor} as="h6">
        <AirplaneFill style={{ transform: "rotate(90deg)" }} /> {phase.name}
      </Card.Title>
      <Card.Subtitle style={textColor}>{phase.author}</Card.Subtitle>
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
