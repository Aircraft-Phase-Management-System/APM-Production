import React from "react";
import { Accordion, Row, Button, Col } from "react-bootstrap";
import { useTracker } from "meteor/react-meteor-data";
//import { Events } from "../../api/event_phase/EventCollection";
import { EventsDay } from "../../api/event_day/EventDayCollection";
import LoadingSpinner from "./LoadingSpinner";
import EventItem from "./EventItem";
import { List } from "react-bootstrap-icons";
import AddEventDay from "./AddEventDay";

/* Renders a table containing all of the Event documents. Use <EventItem> to render each row. */
const ListEvent = ({ laneID }) => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready, events } = useTracker(() => {
    // Note that this subscription will get cleaned up
    // when your component is unmounted or deps change.
    // Get access to EventsDay documents.
    const subscription = EventsDay.subscribeEventDay();
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the Stuff documents
    const eventItems = EventsDay.find({}, { sort: { title: 1 } }).fetch();
    return {
      events: eventItems,
      ready: rdy,
    };
  }, []);

  /* Get only the Events that belong to the Phase Lane. */
  //const eventsFromLane = _.filter(events, function(event){ return event.laneID === laneID; });

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
              {/*<AddEvent laneID={laneID}/>*/}
              <AddEventDay/>
            </Col>
          </Row>
          <br />
          <h6>
            <List></List> Today's Events
          </h6>
          {/*events.map((event) => (
            <EventItem key={event._id} event={event} />
          ))*/}
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  ) : (
    <LoadingSpinner message="Loading Event" />
  );
};

export default ListEvent;
