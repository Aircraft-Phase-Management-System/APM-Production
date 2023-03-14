import React from 'react';
import { Button, Col, Container, Image, Row } from 'react-bootstrap';
import { PAGE_IDS } from '../utilities/PageIDs';
import { NavLink } from 'react-router-dom';

/* A simple static component to render some text for the landing page. */
const Landing = () => (
  <Container id={PAGE_IDS.LANDING} className="py-3">
    <Row className="align-middle text-center">
      <Col xs={4}>
        <Image src="/images/logo.png" width="500px" />
      </Col>

      <Col xs={8} className="d-flex flex-column justify-content-center">
        <h1>Aircraft Phase Management System</h1>
        <NavLink to="/signin" className="">
          <Button className="landing-button">Get Started Now</Button>
        </NavLink>
      </Col>
    </Row>
  </Container>
);

export default Landing;
