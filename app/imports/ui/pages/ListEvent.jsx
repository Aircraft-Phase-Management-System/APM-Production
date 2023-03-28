import React from "react";
import { Accordion, Row, Button, Col } from "react-bootstrap";
import { useTracker } from "meteor/react-meteor-data";
import { Events } from "../../api/event_phase/EventCollection";
import LoadingSpinner from "../components/LoadingSpinner";
import EventItem from "../components/EventItem";
import { List } from "react-bootstrap-icons";
import AddEvent from "../components/AddEvent";

/* Renders a table containing all of the Event documents. Use <EventItem> to render each row. */
const ListEvent = ({laneID}) => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready, events } = useTracker(() => {
    // Note that this subscription will get cleaned up
    // when your component is unmounted or deps change.
    // Get access to Stuff documents.
    const subscription = Events.subscribeEvent();
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the Stuff documents
    const eventItems = Events.find({}, { sort: { name: 1 } }).fetch();
    return {
      events: eventItems,
      ready: rdy,
    };
  }, []);

  /* Get only the Events that belong to the Phase Lane. */
  const eventsFromLane = _.filter(events, function(event){ return event.laneID === laneID; });

  return ready ? (
    <Accordion flush>
      <Accordion.Item eventKey="0" >
        <Accordion.Header>Events</Accordion.Header>
        <Accordion.Body>
        <Row>
          <Col>
        <Button href="/list-eventsday" variant="outline-primary" size="sm">
        {' '} All Current Events
      </Button>
      </Col>
      <Col>
          <AddEvent laneID={laneID}/>
          </Col>
          </Row>
          <br />
          <h6><List></List> Today's Events</h6>
          {eventsFromLane.map((event) => (
            <EventItem key={event._id} event={event} />
          ))}
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  ) : (
    <LoadingSpinner message="Loading Event" />
  );
};

export default ListEvent;
