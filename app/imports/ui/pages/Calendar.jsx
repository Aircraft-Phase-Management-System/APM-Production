import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from '@fullcalendar/interaction'
import { Container, Col, Button } from "react-bootstrap";
import { useTracker } from "meteor/react-meteor-data";
// import { ChevronLeft, List } from 'react-bootstrap-icons';
import { Holidays } from "../../api/holiday/HolidayCollection";
import { PAGE_IDS } from "../utilities/PageIDs";
import { formatDate } from '@fullcalendar/core'



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

  handleDateSelect = (selectInfo) => {
    let title = prompt('Please enter a new title for your event')
    let calendarApi = selectInfo.view.calendar

    calendarApi.unselect() // clear date selection

    if (title) {
      calendarApi.addEvent({
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      })
    }
  }

  handleEventClick = (clickInfo) => {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove()
    }
  }

  const eventRender = (info) => {
    if (info.event.extendedProps.type === "holiday") {
      info.el.classList.add("fc-nonbusiness");
      info.el.setAttribute("title", "Unavailable");
    }
  };


    return (
      <div className='demo-app'>
        {renderSideBar(holidays)}
        <div className='demo-app-main'>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            initialView='dayGridMonth'
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            select={handleDateSelect}
            eventContent={renderEventContent} // custom render function
            eventClick={this.handleEventClick}
            /* you can update a remote database when these fire:
            eventAdd={function(){}}
            eventChange={function(){}}
            eventRemove={function(){}}
            */
          />
        </div>
      </div>
    )

}

function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  )
}

function renderSidebarEvent(event) {
  return (
    <li key={event.id}>
      <b>{formatDate(event.start, {year: 'numeric', month: 'short', day: 'numeric'})}</b>
      <i>{event.title}</i>
    </li>
  )
}

export default Calendar;
