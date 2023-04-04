import React, { useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Timeouts } from "../../api/timeout/TimeoutCollection";
import { XSquare, Calendar, HandIndex } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import { Container, Row, Modal, Button, Table, Alert } from "react-bootstrap";

const CalendarPhaseItem = ({ phase, events }) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const letterColor = { color: "white" };

  const { ready, timeouts } = useTracker(() => {
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

  /* Add another field to the timeouts named color with a standard color red. */
  timeouts.forEach(function (element) {
    element.color = "#c22f25";
  });

  /* Modify the eventsDay collection to fit the calendar format */
  events.forEach(function (event) {
    let date = event.day;
    let len = date.length;
    let indexDash = [];
    let day = null;
    let month = null;
    let year = null;

    /* If the data comes from .json file, format. */
    if (date.includes("/")) {
      date = date.split("/").join("-");
      for (let i = 0; i < len - 4; i++) {
        if (date.charAt(i) === "-") {
          indexDash.push(i);
        }
      }
      year = date.substring(len - 4);
      month = date.substring(0, indexDash[0]);
      day = date.substring(indexDash[0] + 1, indexDash[1]);

      month = month.length === 1 ? "0" + month : month;
      day = day.length === 1 ? "0" + day : day;

      date = year + "-" + month + "-" + day;
    }

    if (event.start && event.end) {
      if (!event.start.includes(":")) {
        event.start =
          event.start.substring(0, 2) + ":" + event.start.substring(2);
        event.end = event.end.substring(0, 2) + ":" + event.end.substring(2);
      }
    }

    event.day = date;
  });

  events = _.sortBy(events, "day").reverse();

  /* Modify event.day to event.start to show on Calendar, since it recognizes the date as 'start'. */
  const formattedCalendarEvents = events.map(({ day: start, title }) => ({
    start,
    title,
  }));

  Array.prototype.push.apply(formattedCalendarEvents, timeouts);

  const renderSideBar = () => {
    return (
      <div className="app-sidebar-item">
        <Container style={{ backgroundColor: phase.color, padding: 14 }}>
          <Row>
            <h6 style={letterColor}>
              {phase.issue} {phase.name}
            </h6>
          </Row>
            <Alert variant={"light"}>
              <p>
                Click{" "}<HandIndex/>{" "}
                <Link to="/list-eventsday"> here</Link> to see all of the events.
              </p>
            </Alert>
            <h6 style={letterColor}>The 10 Most Recent Events</h6>
          <Table striped borderless hover variant="dark">
            <thead>
              <tr>
                <th>Date</th>
                <th>Event</th>
              </tr>
            </thead>
            <tbody>
              {events.slice(0, 10).map((event) => (
                <CalendarPhaseRow key={event._id} event={event} />
              ))}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  };

  return (
    <>
      <Button variant="light" size="sm" onClick={handleShow}>
        <Calendar />
      </Button>

      <Modal size="xl" show={show} onHide={handleClose}>
        <Modal.Body>
          <div className="demo-app">
            {renderSideBar()}
            <div className="demo-app-main">
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                }}
                initialView="dayGridMonth"
                editable={true}
                events={formattedCalendarEvents}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                eventContent={renderEventContent} // custom render function
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={handleClose}>
            <XSquare style={{ marginBottom: "4px", marginRight: "6px" }} />
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
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

const CalendarPhaseRow = ({ event }) => (
  <tr>
    <td>
      <b>{event.day}</b>
    </td>
    <td>{event.title}</td>
  </tr>
);

export default CalendarPhaseItem;
