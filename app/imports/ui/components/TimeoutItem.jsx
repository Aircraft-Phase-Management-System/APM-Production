import React, { useState } from "react";
import PropTypes from "prop-types";
import { Col, Container, Row, Table, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { COMPONENT_IDS } from "../utilities/ComponentIDs";
import EditTimeout from "../pages/EditTimeout";

/** Renders a single row in the List Timeout table. See pages/ListTimeout.jsx. */
const TimeoutItem = ({ timeout }) => (

  <tr>
  <td>{timeout.title}</td>
  <td>{timeout.start}</td>
  <td>{timeout.end}</td>
  <td>{timeout.type}</td>
  <td>{timeout.hours}</td>
  <td><EditTimeout key={timeout._id} timeout={timeout}/></td>
</tr>
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
