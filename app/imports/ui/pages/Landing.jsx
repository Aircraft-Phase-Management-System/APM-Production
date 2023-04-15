import React from "react";
import { Button, Col, Container, Row, Link } from "react-bootstrap";
import { PAGE_IDS } from "../utilities/PageIDs";
import { NavLink } from "react-router-dom";
import { HandIndexThumb } from "react-bootstrap-icons";

function checkSignInState() {
  if (Meteor.userId()) {
    return "/main-calendar";
  }
  return "/signin";
}

/* A simple static component to render some text for the landing page. */
const Landing = () => (
  <Container id={PAGE_IDS.LANDING} className="py-3">
    <Row className="align-middle text-center">
      <Col className="d-flex flex-column justify-content-center">
        <h1>Aircraft Phase Management System</h1>
        <p>Welcome to Aircraft Phase Lane Management System! </p>
        <p>
          Our user-friendly platform helps you streamline and monitor your
          aircraft's maintenance. Stay compliant and airworthy with our
          comprehensive approach.{" "}
        </p>
        <p>
          Trust us to keep your aircraft running smoothly and efficiently. Thank
          you for choosing our system!
        </p>
      </Col>
    </Row>
    <Col className="d-flex justify-content-center">
      <Button color="green" size="sm" href={`${checkSignInState()}`}>
        START HERE! <HandIndexThumb />
      </Button>
    </Col>
  </Container>
);

export default Landing;
