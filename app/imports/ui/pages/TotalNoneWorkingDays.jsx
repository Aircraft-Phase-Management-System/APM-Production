import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Holidays } from "../../api/holiday/HolidayCollection";
import HolidayItem from "../components/HolidayItem";
import LoadingSpinner from "../components/LoadingSpinner";
import { Col, Container, Row, Table, Card } from "react-bootstrap";
import { PAGE_IDS } from "../utilities/PageIDs";

/* Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
const TotalNoneWorkingDays = () => {
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
      <Container id={PAGE_IDS.TOTAL_NONE_WORKING_DAYS} className="total-none-working-days">
        <h>Total None Working days</h>
      </Container>
    ) : (
      <LoadingSpinner message="Loading Holiday" />
    );
  };
  
  export default TotalNoneWorkingDays;
  