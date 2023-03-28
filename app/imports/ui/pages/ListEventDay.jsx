import React, { useState } from "react";
import {
  Container,
  Row,
  Table,
  Card,
  InputGroup,
  Form
} from "react-bootstrap";
import { List, Search } from "react-bootstrap-icons";
import { useTracker } from "meteor/react-meteor-data";
import { EventsDay } from "../../api/event_day/EventDayCollection";
import EventDayItem from "../components/EventDayItem";
import LoadingSpinner from "../components/LoadingSpinner";
import { PAGE_IDS } from "../utilities/PageIDs";

/* Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
const ListEventDay = () => {
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
    const eventsDayItems = EventsDay.find({}, { sort: { title: 1 } }).fetch();
    console.log(eventsDayItems);
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
      <Card className="card-list-eventsday">
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
        <Row className="card-list-row-eventsday">
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
      </Row>
      </Card>
    </Container>
  ) : (
    <LoadingSpinner message="Loading eventday" />
  );
};

export default ListEventDay;
