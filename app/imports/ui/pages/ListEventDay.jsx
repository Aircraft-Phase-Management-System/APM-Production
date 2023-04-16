import React, { useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
import LoadingSpinner from "../components/LoadingSpinner";
import { PAGE_IDS } from "../utilities/PageIDs";
import { useLocation } from "react-router-dom";
import { EventsDay } from "../../api/event_day/EventDayCollection";
import { Phases } from "../../api/phase_lane/PhaseCollection";
import EventDayItem from "../components/EventDayItem";
import { Container, Table, Card, InputGroup, Form } from "react-bootstrap";
import { List, Search } from "react-bootstrap-icons";

/* Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
const ListEventDay = () => {
  const [query, setQuery] = useState("");

  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready, phases } = useTracker(() => {
    // Note that this subscription will get cleaned up
    // when your component is unmounted or deps change.
    // Get access to Stuff documents.
    const subscription = Phases.subscribePhase();
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the Stuff documents
    const phaseItems = Phases.find().fetch();

    return {
      phases: phaseItems,
      ready: rdy,
    };
  }, []);

  const { ready2, eventsday } = useTracker(() => {
    // Note that this subscription will get cleaned up
    // when your component is unmounted or deps change.
    // Get access to Stuff documents.
    const subscription = EventsDay.subscribeEventDay();
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the Stuff documents
    const eventsDayItems = EventsDay.find({}, { sort: { day: 1 } }).fetch();

    return {
      eventsday: eventsDayItems,
      ready2: rdy,
    };
  }, []);


  const getLaneIssueNumber = () => {
    const location = useLocation();
    const laneID = location.pathname.substring(16);
    const phaseLane = phases.filter((phase) => { return phase._id === laneID; });
    return phaseLane[0].issue;
  };

  const eventsFromLane = eventsday.filter((eventday) => { return eventday.laneID === getLaneIssueNumber() ; });

  const filteredData = eventsFromLane.filter((eventday) => {
    const lowerCase = query.toLowerCase();
    return eventday.title.toLowerCase().startsWith(lowerCase);
  });

  return ready ? (
    <Container id={PAGE_IDS.LIST_EVENTSDAY} className="py-3">
      <Card className="card-list-eventsday">
        <Card.Title>
          <List /> All Current Events For Phase Lane {getLaneIssueNumber()} ({eventsFromLane.length})
        </Card.Title>
        <br />
        <InputGroup>
          <InputGroup.Text>
            <Search></Search>
          </InputGroup.Text>
          <Form.Control
            placeholder="Search by title..."
            onChange={(event) => setQuery(event.target.value)}
          />
        </InputGroup>
        <br />
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Title</th>
              <th>Date</th>
              <th>Start</th>
              <th>End</th>
              <th>Time (Mins)</th>
              <th>Type</th>
              <th>ML1</th>
              <th>ML2</th>
              <th>ML3</th>
              <th>Section</th>
              <th>Remarks</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((eventday) => (
              <EventDayItem key={eventday._id} event={eventday} />
            ))}
          </tbody>
        </Table>
      </Card>
    </Container>
  ) : (
    <LoadingSpinner message="Loading eventday" />
  );
};

export default ListEventDay;
