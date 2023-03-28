import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { COMPONENT_IDS } from "../utilities/ComponentIDs";
//import EditTimeout from "../pages/EditTimeout";

/** Renders a single row in the List Timeout table. See pages/ListTimeout.jsx. */
const EventDayItem = ({ event }) => (
  <tr>
  <td>{event.title}</td>
  <td>{event.day}</td>
  <td>{event.start}</td>
  <td>{event.end}</td>
  <td>{event.min}</td>
  <td>{event.type}</td>
  <td>{event.ml1}</td>
  <td>{event.ml2}</td>
  <td>{event.ml3}</td>
  <td>{event.section}</td>
  <td>{event.remarks}</td>
  {/*<td><EditTimeout key={timeout._id} timeout={timeout}/></td>*/}
</tr>
);

export default EventDayItem;
