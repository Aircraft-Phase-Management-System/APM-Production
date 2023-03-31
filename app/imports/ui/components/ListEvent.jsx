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
const ListEvent = ({ laneID }) => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready, eventsDay } = useTracker(() => {
    // Note that this subscription will get cleaned up
    // when your component is unmounted or deps change.
    // Get access to EventsDay documents.
    const subscription = EventsDay.subscribeEventDay();
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the Stuff documents
    const eventsDayItems = EventsDay.find({}, { sort: { title: 1 } }).fetch();
    return {
      eventsDay: eventsDayItems,
      ready: rdy,
    };
  }, []);

  /* Modify date format from DD/MM/YYYY to YYYY-MM-DD */
  //let formattedEventsDay = _.forEach(eventsDay, function(event){ return event.day.split('/').join('-')});

  /* Add another field to the timeouts named color with a standard color red. */
  eventsDay.forEach(function (event) {
    let date = event.day;
    let len = date.length;
    let indexDash = [];
    let day = null;
    let month = null;
    let year = null;

    /* If the data comes from .json file, format. */
    if (date.includes("/")) {
      date = date.split("/").join("-");
      for (let i = 0; i < len - 4; i++) {
        if (date.charAt(i) === "-") {
          indexDash.push(i);
        }
      }
      year = date.substring(len - 4);
      month = date.substring(0, indexDash[0]);
      day = date.substring(indexDash[0] + 1, indexDash[1]);

      month = (month.length === 1) ? "0" + month : month;
      day = (day.length === 1) ? "0" + day: day;

      date = year + "-" + month + "-" + day;
    }

    event.day = date;
  });

  /* Get only the Events that belong to the Phase Lane and from today. */
  const todayDate = new Date();
  const offset = todayDate.getTimezoneOffset();
  const formattedDate = new Date(todayDate.getTime() - offset * 60 * 1000)
    .toISOString()
    .split("T")[0];
  const eventsFromLane = _.filter(eventsDay, function (event) {
    return event.day === formattedDate;
  });

  return ready ? (
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
          {/*events.map((event) => (
            <EventItem key={event._id} event={event} />
          ))*/}
          {eventsFromLane.map((event) => (
            <EventSameDayItem key={event._id} event={event} />
          ))}
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  ) : (
    <LoadingSpinner message="Loading Event" />
  );
};

export default ListEvent;
