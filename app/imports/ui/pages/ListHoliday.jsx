import React from "react";
import { Col, Container, Row, Table, Card } from "react-bootstrap";
import { useTracker } from "meteor/react-meteor-data";
import { Holidays } from "../../api/holiday/HolidayCollection";
import HolidayItem from "../components/HolidayItem";
import LoadingSpinner from "../components/LoadingSpinner";
import { PAGE_IDS } from "../utilities/PageIDs";

/* Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
const ListHoliday = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready, holidays } = useTracker(() => {
    // Note that this subscription will get cleaned up
    // when your component is unmounted or deps change.
    // Get access to Stuff documents.
    const subscription = Holidays.subscribeHoliday();
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the Stuff documents
    const holidayItems = Holidays.find({}, { sort: { title: 1 } }).fetch();
    return {
      holidays: holidayItems,
      ready: rdy,
    };
  }, []);
  return ready ? (
    <Container id={PAGE_IDS.LIST_HOLIDAY} className="py-3">
      <Card className="card-list-holidays">
        <Card.Title>ALL CURRENT HOLIDAYS</Card.Title>
        <Row>
          <Col sm={8}><h6>Name</h6></Col>
          <Col sm={3}><h6>Date</h6></Col>
          <Col sm={1}><h6>Modify</h6></Col>
          </Row>
          {holidays.map((holiday) => (
            <HolidayItem key={holiday._id} holiday={holiday} />
          ))}

      </Card>
    </Container>
  ) : (
    <LoadingSpinner message="Loading Holiday" />
  );
};

export default ListHoliday;
