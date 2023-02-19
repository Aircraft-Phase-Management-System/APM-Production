import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Container, Col, Button } from 'react-bootstrap';
import { ChevronLeft, List } from 'react-bootstrap-icons';
// import Legtracker from '../utilities/Legtracker';
//import CalModal from '../components/modals/CalModal';
import { PAGE_IDS } from "../utilities/PageIDs";

const Calendar = () => {

  return (
    <Col>
      <div id={PAGE_IDS.MAIN_CALENDAR} className="d-flex justify-content-center">
        <Container className="p-lg-5">
          <FullCalendar
            defaultView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay',
            }}
            plugins={[dayGridPlugin]}
            /* eslint-disable-next-line react/jsx-no-bind */
          />
        </Container>
      </div>
    </Col>

  );
};

export default Calendar;
