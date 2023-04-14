import React, { useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Timeouts } from "../../api/timeout/TimeoutCollection";
import { XSquare, Calendar, HandIndex, Search } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import {
  Container,
  Row,
  Modal,
  Button,
  Table,
  Alert,
  InputGroup,
  Form,
} from "react-bootstrap";

const CalendarPhaseItem = ({ phase, events }) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [query, setQuery] = useState("");

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

  /* LIST: List events from the current phase lane and apply filter is needed by user. */
  events = _.sortBy(events, "day").reverse();

  const eventsFromLane = events.filter((event) => {
    return event.laneID === phase.issue;
  });

  const filteredData = eventsFromLane.filter((eventday) => {
    const lowerCase = query.toLowerCase();
    return eventday/*.title.toLowerCase().startsWith(lowerCase)*/;
  });

  /* CALENDAR: Modify event.day to event.start to show on Calendar, since it recognizes the date as 'start'. */
  const formattedCalendarEvents = eventsFromLane.map(({ day: start, title, _id }) => ({
    start,
    title,
    _id,
  }));

  Array.prototype.push.apply(formattedCalendarEvents, timeouts);

  console.log(eventsFromLane);

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
              Click <HandIndex />{" "}
              <Link to={`/list-eventsday/${phase._id}`}> here</Link> to see all
              of the events.
            </p>
          </Alert>

          <InputGroup>
            <InputGroup.Text>
              <Search></Search>
            </InputGroup.Text>
            <Form.Control
              placeholder="Search by title..."
              onChange={(event) => setQuery(event.target.value)}
            />
          </InputGroup>

          <Table striped borderless hover variant="dark">
            <thead>
              <tr>
                <th>Date</th>
                <th>Event</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.slice(0, 20).map((event) => (
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
