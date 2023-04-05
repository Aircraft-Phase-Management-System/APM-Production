import React from "react";
import { Accordion, Row, Button, Col } from "react-bootstrap";
import { useTracker } from "meteor/react-meteor-data";
//import { Events } from "../../api/event_phase/EventCollection";
import { EventsDay } from "../../api/event_day/EventDayCollection";
import LoadingSpinner from "./LoadingSpinner";
import EventItem from "./EventItem";
import { List } from "react-bootstrap-icons";
import AddEventDay from "./AddEventDay";
import EventSameDayItem from "./EventSameDayItem";

/* Renders a table containing all of the Event documents. Use <EventItem> to render each row. */
const ListEvent = ({ laneID, eventsDay }) => {

  /* Get only the Events that belong to the Phase Lane and from today. */
  const todayDate = new Date();
  const offset = todayDate.getTimezoneOffset();
  const formattedDate = new Date(todayDate.getTime() - offset * 60 * 1000)
    .toISOString()
    .split("T")[0];
  const eventsFromLane = _.filter(eventsDay, function (event) {
    return event.day === formattedDate;
  });


  return (
    <Accordion flush>
      <Accordion.Item eventKey="0">
        <Accordion.Header>Events</Accordion.Header>
        <Accordion.Body>
          <Row>
            <Col>
              <Button
                href="/list-eventsday"
                variant="outline-primary"
                size="sm"
              >
                {" "}
                All Current Events
              </Button>
            </Col>
            <Col>
              <AddEventDay laneID={laneID} eventsDay={eventsDay} />
            </Col>
          </Row>
          <br />
          <h6>
            <List /> Today's Events
          </h6>
          {eventsFromLane.map((event) => (
            <EventSameDayItem key={event._id} event={event} />
          ))}
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

export default ListEvent;
