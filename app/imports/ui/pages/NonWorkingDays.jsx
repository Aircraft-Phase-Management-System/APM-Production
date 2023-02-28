import React from 'react';
import { Col, Container, Nav, Row, Tab} from 'react-bootstrap';
import { PAGE_IDS } from '../utilities/PageIDs';

import AddHoliday from './AddHoliday';
import ListHoliday from './ListHoliday';
import TotalNoneWorkingDays from './TotalNoneWorkingDays';

function NonWorkingDays() {
  return (
    <Container id={PAGE_IDS.NON_WORKING_DAYS} className="card-non-working-days">
    <Tab.Container id="left-tabs-example" defaultActiveKey="first">
      <Row>
        <Col sm={3}>
          <Nav variant="pills" className="flex-column">
            <Nav.Item>
              <Nav.Link eventKey="first">Current Holidays</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="second">Current Training Days</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="third">Total Non-Working days</Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
        <Col sm={9}>
          <Tab.Content>
            <Tab.Pane eventKey="first">
              <AddHoliday/>
              <ListHoliday/>
            </Tab.Pane>
            <Tab.Pane eventKey="second">
            <p>WILL MERGE WITH HOLIDAYS</p>
            </Tab.Pane>
            <Tab.Pane eventKey="third">
              <TotalNoneWorkingDays/>
              <ListHoliday/>
            </Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
    </Container>
  );
}

export default NonWorkingDays;