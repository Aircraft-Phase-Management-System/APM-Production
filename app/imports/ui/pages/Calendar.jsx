import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { Container, Col, Button } from "react-bootstrap";
import { useTracker } from "meteor/react-meteor-data";
// import { ChevronLeft, List } from 'react-bootstrap-icons';
import { Holidays } from "../../api/holiday/HolidayCollection";
import { PAGE_IDS } from "../utilities/PageIDs";

/*const EVENTS = [
  { title: "event 1", start: "2023-02-20", end: "2023-02-24" },
  { title: "Holiday 1", start: new Date() },
];*/


const Calendar = () => {
  const { ready, holidays } = useTracker(() => {
    // Note that this subscription will get cleaned up
    // when your component is unmounted or deps change.
    // Get access to Stuff documents.
    const subscription = Holidays.subscribeHoliday();
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the Stuff documents
    const holidayItems = Holidays.find(
      {},
      { sort: { holidayName: 1 } }
    ).fetch();
    // if (holidayItems[0] != null) defaultHolidays.push(holidayItems[0]);

    return {
      holidays: holidayItems,
      ready: rdy,
    };
  }, []);

  /* const EVENTS = defaultHolidays.map(
    ({ holidayName: title, date: start, _id, owner, ...rest }) => ({
      title,
      start,
      ...rest,
    })
  );*/

  return (
    <div className="demo-app">
      {renderSideBar(holidays)}
      <Col>
        <div
          id={PAGE_IDS.MAIN_CALENDAR}
          className="d-flex justify-content-center"
        >
          <Container className="p-lg-5">
            <FullCalendar
              defaultView="dayGridMonth"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
              }}
              plugins={[dayGridPlugin]}
              /* weekends={false} */
              events={holidays}
              eventContent={renderEventContent}

              /* eslint-disable-next-line react/jsx-no-bind */
            />
          </Container>
        </div>
      </Col>
    </div>
  );
};

const renderSideBar = (holidays) => {
    return (
      <div className="demo-app-sidebar">
        <div className="demo-app-sidebar-section">
          <h2>Instructions</h2>
          <ul>
            <li>Select dates and you will be prompted to create a new event</li>
            <li>Drag, drop, and resize events</li>
            <li>Click an event to delete it</li>
          </ul>
        </div>
        <div className="demo-app-sidebar-section">
          <h3>All Holidays ({holidays.length})</h3>
          <ul>{holidays.map(renderSidebarEvent)}</ul>
        </div>
      </div>
    );
  };
  
  function renderSidebarEvent(event) {
    return (
      <li /*key={event.id}*/>
        <b>
          {moment(event.start, "YYYY-MM-DD").format("MM-DD")}
        </b>
        <i>{' '}{event.title}</i>
      </li>
    );
  }

function renderEventContent(event) {
  return (
    <>
      <i>{event.event.title}</i>
    </>
  );
}

export default Calendar;
