import React, { useState } from "react";
import PropTypes from "prop-types";
import { Col, Container, Row, Table, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { COMPONENT_IDS } from "../utilities/ComponentIDs";
import EditTimeout from "../pages/EditTimeout";

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
const TimeoutItem = ({ timeout }) => (
  <div className="timeout-item-row">
  <Row>
    <Col sm={8}>{timeout.title}</Col>
    <Col sm={3}>{timeout.start}</Col>
    <Col sm={1}><EditTimeout key={timeout._id} timeout={timeout}/></Col>
  </Row>
  </div>
);

// Require a document to be passed to this component.
TimeoutItem.propTypes = {
  timeout: PropTypes.shape({
    title: PropTypes.string,
    start: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

export default TimeoutItem;
