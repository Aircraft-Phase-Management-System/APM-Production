import React from "react";
import EditEventDay from "../pages/EditEventDay";
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

/** Renders a single row in the List Event Day table. See pages/ListEventDay.jsx. */
const EventDayItem = ({ event, code }) => (
  <tr>
  {code === 1 ? <td>{event.laneID}</td>: ''}
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
  <td><EditEventDay className={COMPONENT_IDS.LIST_EVENT_DAY}  key={event._id} event={event}/></td>
</tr>
);

export default EventDayItem;
