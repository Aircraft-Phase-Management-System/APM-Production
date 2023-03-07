import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Container, Col, Row, Button, Card } from "react-bootstrap";
import { useTracker } from "meteor/react-meteor-data";
import { PlusSquare } from "react-bootstrap-icons";
import { Holidays } from "../../api/holiday/HolidayCollection";
import { Events } from "../../api/event_phase/EventCollection";
import { PAGE_IDS } from "../utilities/PageIDs";
import { formatDate } from "@fullcalendar/core";
import PhaseLaneItem from "../components/PhaseLaneItem";

const phaseLanes = [
  {
    id: "r0",
    name: "Flight Lane 1",
    author: "Team 1",
    bgColor: "#3788d8",
    issue: "#1",
  },
  {
    id: "r1",
    name: "Flight Lane 2",
    author: "Team 2",
    bgColor: "#87aef5",
    issue: "#2",
  },
  {
    id: "r2",
    name: "Flight Lane 3",
    author: "Team 3",
    bgColor: "#3788d8",
    issue: "#3",
  },
  {
    id: "r3",
    name: "Flight Lane 4",
    author: "Team 4",
    bgColor: "#87aef5",
    issue: "#4",
  },
  {
    id: "r4",
    name: "Flight Lane 5",
    author: "Team 5",
    bgColor: "#3788d8",
    issue: "#5",
  },
  {
    id: "r5",
    name: "Flight Lane 6",
    author: "Team 6",
    bgColor: "#87aef5",
    issue: "#6",
  },
  {
    id: "r6",
    name: "Flight Lane 7",
    author: "Team 7",
    bgColor: "#3788d8",
    issue: "#7",
  },
  {
    id: "r7",
    name: "Flight Lane 8",
    author: "Team 8",
    bgColor: "#87aef5",
    issue: "#8",
  },
];

const Calendar = () => {
  const { ready, holidays } = useTracker(() => {
    let isHoliday = "";

    // let hd = new FederalHolidays('US');
    const subscription = Holidays.subscribeHoliday();
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the Stuff documents
    const holidayItems = Holidays.find(
      {},
      { sort: { holidayName: 1 } }
    ).fetch();

    return {
      holidays: holidayItems,
      ready: rdy,
    };
  }, []);

  const { ready1, events } = useTracker(() => {
    // Get access to Stuff documents.
    const subscription = Events.subscribeEvent();
    // Determine if the subscription is ready
    const rdy1 = subscription.ready();
    // Get the Stuff documents
    const eventItems = Events.find({}, { sort: { title: 1 } }).fetch();
    console.log(eventItems);
    return {
      events: eventItems,
      ready1: rdy1,
    };
  }, []);

  

  const renderSideBar = (phaseLanes) => {
    return (
      <div className="app-sidebar">
        <Container>
          <Row>
            <div className="d-grid gap-2">
              <Button variant="light">
                <PlusSquare /> <Col>Create New Phase Lane</Col>
              </Button>
            </div>
          </Row>
          <Row>
            {phaseLanes.map((phase) => (
              <PhaseLaneItem key={phase._id} phase={phase} />
            ))}
          </Row>
        </Container>
      </div>
    );
  };

  const holidayDate = holidays[1]; // test

  handleDateClick = (clickInfo) => {
    // bind with an arrow function

    console.log(clickInfo.dateStr);
    for (let n = 0; n < holidays.length; n++) {
      if (clickInfo.dateStr == holidays[n].start) {
        alert(clickInfo.dateStr + " is a Holiday \n You can't edit this date");
        console.log(holidays);
        return;
      }
    }
    let title = prompt("Please enter a new title for your event");
    if (title) {
      calendarApi.addEvent({
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      });
    }
    alert(clickInfo.dateStr);
  };

  handleDateSelect = (selectInfo) => {
    console.log(selectInfo.startStr);
    let title = prompt("Please enter a new title for your event");
    let calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      });
    }
  };

  handleEventClick = (clickInfo) => {
    if (
      confirm(
        `Are you sure you want to delete the event '${clickInfo.event.title}'`
      )
    ) {
      clickInfo.event.remove();
      holidays.removeIt(clickInfo.event.title);
    }
  };

  const eventRender = (clickInfo) => {
    if (clickInfo.event.type === "holidays") {
      clickInfo.el.classList.add("fc-nonbusiness");
      clickInfo.el.setAttribute("title", "Unavailable");
      return false;
    } else {
      return true;
    }
  };

  return (
    <div className="demo-app">
      {renderSideBar(phaseLanes)}
      <div className="demo-app-main">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          initialView="dayGridMonth"
          editable={true}
          events={events}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          dateClick={handleDateClick}
          //select={handleDateSelect}
          eventContent={renderEventContent} // custom render function
          eventClick={this.handleEventClick}
        />
      </div>
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

function renderSidebarEvent(event) {
  return (
    <li key={event.id}>
      <b>
        {formatDate(event.start, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </b>
      <i>{event.title}</i>
    </li>
  );
}

export default Calendar;
