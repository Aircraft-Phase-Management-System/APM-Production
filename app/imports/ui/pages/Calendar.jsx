import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { Container, Col, Button } from "react-bootstrap";
// import { ChevronLeft, List } from 'react-bootstrap-icons';
import { PAGE_IDS } from "../utilities/PageIDs";

// const events = [{ title: "Meeting", start: new Date() }];

const EVENTS = [
  { title: "event 1", start: "2023-02-20", end: "2023-02-24" },
  { title: "Holiday 1", start: new Date() },
];

const renderSideBar = () => {
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
        <h3>All Events ({EVENTS.length})</h3>
        <ul>{EVENTS.map(renderSidebarEvent)}</ul>
      </div>
    </div>
  );
};

function renderSidebarEvent(event) {
    return (
      <li /*key={event.id}*/>
        <b>{moment(event.start, 'YYYY-MM-DD').format('MM-DD')} to {moment(event.end, 'YYYY-MM-DD').format('MM-DD')} </b>
        <i>{event.title}</i>
      </li>
    )
}

const Calendar = () => {
  return (
    <div className='demo-app'>
        {renderSideBar()}
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
            events={
              EVENTS /*[
              { title: "event 1", date: "2023-02-20" },
              { title: "event 2", date: "2023-02-22" },
            ]*/
            }
            eventContent={renderEventContent}

            /* eslint-disable-next-line react/jsx-no-bind */
          />
        </Container>
      </div>
    </Col>
    </div>
  );
};

function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
}

export default Calendar;
