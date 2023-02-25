import React, { useState } from "react";
import PropTypes from "prop-types";
import { Col, Container, Row, Table, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { COMPONENT_IDS } from "../utilities/ComponentIDs";
import EditHoliday from "../pages/EditHoliday";

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
const HolidayItem = ({ holiday }) => (
  <div className="holiday-item-row">
  <Row>
    <Col sm={8}>{holiday.title}</Col>
    <Col sm={3}>{holiday.start}</Col>
    <Col sm={1}><EditHoliday key={holiday._id} holiday={holiday}/></Col>
  </Row>
  </div>
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
