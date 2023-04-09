import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Container, Col, Row, Button, Card } from "react-bootstrap";
import { useTracker } from "meteor/react-meteor-data";
import { Timeouts } from "../../api/timeout/TimeoutCollection";
import { EventsDay } from "../../api/event_day/EventDayCollection";
import { Phases } from "../../api/phase_lane/PhaseCollection";
import { PAGE_IDS } from "../utilities/PageIDs";
import { formatDate } from "@fullcalendar/core";
import PhaseLaneItem from "../components/PhaseLaneItem";
import AddPhaseLane from "../components/AddPhaseLane";
import { date } from "yup";
import ImportButton from "../components/ImportButton";

const Calendar = () => {
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

  /* Get all the day events */
  const { ready1, events } = useTracker(() => {
    // Get access to Stuff documents.
    const subscription = EventsDay.subscribeEventDay();
    // Determine if the subscription is ready
    const rdy1 = subscription.ready();
    // Get the Stuff documents
    const eventItems = EventsDay.find({}, { sort: { title: 1 } }).fetch();
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

  /* Add another field to the timeouts named color with a standard color red. */
  timeouts.forEach(function (element) {
    element.color = "#c22f25";
  });

  //console.log(events);
  /*  const formattedCalendarEvents = events.map(({ start: startHour, day: start, ...rest }) => ({
    startHour,
    start,
    ...rest,
  })); */

  //const dateWithHour = events.map(event => ({day: event.day + " " + event.hour, ...rest}));
  // console.log(dateWithHour);

  /* Modify event.day to event.start to show on Calendar, since it recognizes the date as 'start'. */
  const formattedCalendarEvents = events.map(({ day: start, title, _id }) => ({
    start,
    title,
    _id
  }));

  Array.prototype.push.apply(formattedCalendarEvents, timeouts);

  const renderSideBar = () => {
    return (
      <div className="app-sidebar">
        <Container>
          <Row>
         <ImportButton/>
          </Row> 
          <Row>
            <AddPhaseLane/>
          </Row>
          <Row>
            {phases.map((phase) => (
              <PhaseLaneItem key={phase._id} phase={phase} eventsDay={events} />
            ))}
          </Row>
        </Container>
      </div>
    );
  };

  handleDateClick = (clickInfo) => {
    // bind with an arrow function

    console.log(clickInfo.dateStr);
    for (let n = 0; n < timeouts.length; n++) {
      if (clickInfo.dateStr == timeouts[n].start) {
        alert(clickInfo.dateStr + " is a Holiday \n You can't edit this date");
        console.log(timeouts);
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
      timeouts.removeIt(clickInfo.event.title);
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
          }}
          initialView="dayGridMonth"
          editable={true}
          events={formattedCalendarEvents}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          dateClick={handleDateClick}
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
export default Calendar;
