import React from "react";
import { Col, Container, Row, Table, Card } from "react-bootstrap";
import { List } from 'react-bootstrap-icons';
import { useTracker } from "meteor/react-meteor-data";
import { Timeouts } from "../../api/timeout/TimeoutCollection";
import TimeoutItem from "../components/TimeoutItem";
import LoadingSpinner from "../components/LoadingSpinner";
import { PAGE_IDS } from "../utilities/PageIDs";

/* Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
const ListTimeout = () => {
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
  return ready ? (
    <Container id={PAGE_IDS.LIST_TIMEOUT} className="py-3">
      <Card className="card-list-timeouts">
        <Card.Title><List/> All Current Timeouts ({timeouts.length})</Card.Title>
        <Row className="card-list-row-timeouts">
          <Col sm={3}><h6>Name</h6></Col>
          <Col sm={2}><h6>Start Date</h6></Col>
          <Col sm={2}><h6>End Date</h6></Col>
          <Col sm={2}><h6>Type</h6></Col>
          <Col sm={2}><h6>Hours</h6></Col>
          <Col sm={1}><h6>Modify</h6></Col>
          </Row>
          {timeouts.map((timeout) => (
            <TimeoutItem key={timeout._id} timeout={timeout} />
          ))}

      </Card>
    </Container>
  ) : (
    <LoadingSpinner message="Loading Timeout" />
  );
};

export default ListTimeout;
