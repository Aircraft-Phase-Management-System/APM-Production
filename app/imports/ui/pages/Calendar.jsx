import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Container, Col, Row, Button, Card } from "react-bootstrap";
import { useTracker } from "meteor/react-meteor-data";
import { Holidays } from "../../api/holiday/HolidayCollection";
import { Events } from "../../api/event_phase/EventCollection";
import { Phases } from "../../api/phase_lane/PhaseCollection";
import { PAGE_IDS } from "../utilities/PageIDs";
import { formatDate } from "@fullcalendar/core";
import PhaseLaneItem from "../components/PhaseLaneItem";
import AddEvent from "../components/AddEvent";
import AddPhaseLane from "../components/AddPhaseLane";

const testEvents = [
  {
    title: "PMI 1",
    start: "2023-03-20",
    end: "2023-12-19",
    bgColor: "#17C8E7",
    owner: "john@foo.com",
  },
];

console.log(testEvents);

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
    return {
      events: eventItems,
      ready1: rdy1,
    };
  }, []);

  const { ready2, phases } = useTracker(() => {
    // Get access to Stuff documents.
    const subscription = Phases.subscribePhase();
    // Determine if the subscription is ready
    const rdy2 = subscription.ready();
    // Get the Stuff documents
    const phaseItems = Phases.find({}, { sort: { name: 1 } }).fetch();
    return {
      phases: phaseItems,
      ready2: rdy2,
    };
  }, []);

  const renderSideBar = () => {
    return (
      <div className="app-sidebar">
        <Container>
          {/* ROW TO BE REMOVED */}
          <Row>
         <AddEvent/>
          </Row>
          {/* ROW TO BE REMOVED */}
          <Row>
            <AddPhaseLane/>
          </Row>
          <Row>
            {phases.map((phase) => (
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
      {renderSideBar()}
      <div className="demo-app-main">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            /*right: "dayGridMonth,timeGridWeek,timeGridDay", */
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
