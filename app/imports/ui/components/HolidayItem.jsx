import React from "react";
import PropTypes from "prop-types";
import { Col, Container, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { COMPONENT_IDS } from "../utilities/ComponentIDs";

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
const HolidayItem = ({ holiday }) => (
  <Row>
    <Col sm={8}>{holiday.title}</Col>
    <Col sm={3}>{holiday.start}</Col>
    <Col><Link className={COMPONENT_IDS.LIST_HOLIDAY_EDIT} to={`/edit/${holiday._id}`}>Edit</Link></Col>
  </Row>
);

// Require a document to be passed to this component.
HolidayItem.propTypes = {
  holiday: PropTypes.shape({
    title: PropTypes.string,
    start: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

export default HolidayItem;
