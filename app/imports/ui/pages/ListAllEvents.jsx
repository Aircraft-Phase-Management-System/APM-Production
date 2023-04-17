import React, { useState } from "react";
import { PAGE_IDS } from "../utilities/PageIDs";
import { useTracker } from "meteor/react-meteor-data";
import LoadingSpinner from "../components/LoadingSpinner";
import { EventsDay } from "../../api/event_day/EventDayCollection";
import EventDayItem from "../components/EventDayItem";
import { Container, Table, Card, InputGroup, Form } from "react-bootstrap";
import { List, Search } from "react-bootstrap-icons";

/* Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
const ListAllEvents = () => {
  const [query, setQuery] = useState("");

  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready, eventsday } = useTracker(() => {
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
      ready: rdy,
    };
  }, []);

  const filteredData = eventsday.filter((eventday) => {
    const lowerCase = query.toLowerCase();
    return eventday.title.toLowerCase().startsWith(lowerCase);
  });

  return ready ? (
    <Container id={PAGE_IDS.LIST_EVENTSDAY} className="py-3">
      <Card className="card-list-all-eventsday">
        <Card.Title>
          <List /> All Current Events ({eventsday.length})
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
              <th>Lane</th>
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
              <EventDayItem key={eventday._id} event={eventday} code={1} />
            ))}
          </tbody>
        </Table>
      </Card>
    </Container>
  ) : (
    <LoadingSpinner message="Loading Events" />
  );
};

export default ListAllEvents;
