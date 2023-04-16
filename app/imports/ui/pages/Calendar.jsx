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
    element.color = (element.type === 'Holiday' ? '#c22f25' : '#D7A743');
  });

  /* Modify event.day to event.start to show on Calendar, since it recognizes the date as 'start'. */
  const formattedCalendarEvents = events.map(({ day: start, title, _id }) => ({
    start,
    title,
    _id,
  }));

  Array.prototype.push.apply(formattedCalendarEvents, timeouts);

  const renderSideBar = () => {
    return (
      <div className="app-sidebar">
        <Container>
          <Row>
            <ImportButton />
          </Row>
          <Row>
            <AddPhaseLane />
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
    const sameDayEvents = _.filter(events, (event) => {
      return event.day === clickInfo.dateStr;
    });
    const sumMins = _.reduce(
      sameDayEvents,
      (a, b) => {
        return a + b.min;
      },
      0
    );
    const mls1 = _.reduce(
      sameDayEvents,
      (a, b) => {
        return a + b.ml1;
      },
      0
    );
    const mls2 = _.reduce(
      sameDayEvents,
      (a, b) => {
        return a + b.ml2;
      },
      0
    );
    const mls3 = _.reduce(
      sameDayEvents,
      (a, b) => {
        return a + b.ml3;
      },
      0
    );
    const sumMLs = mls1 + mls2 + mls3;

    const manHrs = (sumMins * sumMLs) / 60 / 12;
    const intHr = Math.floor((sumMins * sumMLs) / 60 / 12);
    const decimalHr = Math.round((manHrs - intHr + Number.EPSILON) * 10) / 10;

    alert(
      `You have selected day ${
        clickInfo.dateStr
      } \n Man-hours Used: ${intHr} hours and ${decimalHr * 60} minutes.`
    );
  };

  handleEventClick = (clickInfo) => {
    const event = _.filter(events, (event) => {
      return clickInfo.event.title === event.title;
    })[0];

    alert(
      `Title: ${event.title} \n Lane: ${event.laneID} \n Type: ${event.type} \n Start: ${event.start} \n End: ${event.end} \n Minutes: ${event.min} \n ML1: ${event.ml1} \n ML2: ${event.ml2} \n ML3: ${event.ml3}`
    );
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
          eventClick={handleEventClick}
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
