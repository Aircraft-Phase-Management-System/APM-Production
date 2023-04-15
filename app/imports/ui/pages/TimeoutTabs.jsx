import React from 'react';
import { Col, Container, Nav, Row, Tab} from 'react-bootstrap';
import { PAGE_IDS } from '../utilities/PageIDs';
import { List, PlusSquare} from 'react-bootstrap-icons';
import AddTimeout from '../components/AddTimeout';
import ListTimeout from '../components/ListTimeout';

function TimeoutTabs() {
  return (
    <Container id={PAGE_IDS.TIMEOUT_TABS} className="timeout-tabs-container">
    <Tab.Container id="left-tabs-example" defaultActiveKey="first">
      <Row>
        <Col sm={3}>
          <Nav variant="pills" className="flex-column">
            <Nav.Item>
              <Nav.Link eventKey="first"><PlusSquare/> Add Timeouts</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="second"><List/> List Timeouts</Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
        <Col sm={9}>
          <Tab.Content>
            <Tab.Pane eventKey="first">
              <AddTimeout/>
              
            </Tab.Pane>
            <Tab.Pane eventKey="second">
            <ListTimeout/>
            </Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
    </Container>
  );
}

export default TimeoutTabs;