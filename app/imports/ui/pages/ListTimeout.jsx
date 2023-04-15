import React, { useState } from "react";
import { Container, Row, Table, Card, InputGroup, Form } from "react-bootstrap";
import { List, Search } from "react-bootstrap-icons";
import { useTracker } from "meteor/react-meteor-data";
import { Timeouts } from "../../api/timeout/TimeoutCollection";
import TimeoutItem from "../components/TimeoutItem";
import LoadingSpinner from "../components/LoadingSpinner";
import { PAGE_IDS } from "../utilities/PageIDs";

/* Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
const ListTimeout = () => {
  const [query, setQuery] = useState("");

  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready, timeouts } = useTracker(() => {
    // Note that this subscription will get cleaned up
    // when your component is unmounted or deps change.
    // Get access to Stuff documents.
    const subscription = Timeouts.subscribeTimeout();
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the Stuff documents
    const timeoutItems = Timeouts.find({}, { sort: { title: 1 } }).fetch();
    return {
      timeouts: timeoutItems,
      ready: rdy,
    };
  }, []);

  const filteredData = timeouts.filter((timeout) => {
    const lowerCase = query.toLowerCase();
    return timeout.title.toLowerCase().startsWith(lowerCase);
  });

  return ready ? (
    <Container id={PAGE_IDS.LIST_TIMEOUT} className="py-3">
      <Card className="card-list-timeouts">
        <Card.Title>
          <List /> All Current Timeouts ({timeouts.length})
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
        <Row className="card-list-row-timeouts">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Title</th>
                <th>Start</th>
                <th>End</th>
                <th>Type</th>
                <th>Hours</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((timeout) => (
                <TimeoutItem key={timeout._id} timeout={timeout} />
              ))}
            </tbody>
          </Table>
        </Row>
      </Card>
    </Container>
  ) : (
    <LoadingSpinner message="Loading Timeout" />
  );
};

export default ListTimeout;
