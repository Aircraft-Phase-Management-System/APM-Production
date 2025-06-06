import React from "react";
import PropTypes from "prop-types";
import EditTimeout from "../pages/EditTimeout";
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

/** Renders a single row in the List Timeout table. See pages/ListTimeout.jsx. */
const TimeoutItem = ({ timeout }) => (
  <tr>
    <td>{timeout.title}</td>
    <td>{timeout.start.substring(0, 10)}</td>
    <td>{timeout.end.substring(0, 10)}</td>
    <td>{timeout.type}</td>
    <td>{timeout.hours}</td>
    <td>
      <EditTimeout className={COMPONENT_IDS.LIST_TIMEOUT_EDIT} key={timeout._id} timeout={timeout} />
    </td>
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
