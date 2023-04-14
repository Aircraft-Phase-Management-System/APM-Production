import React from "react";
import { Meteor } from "meteor/meteor";
import { PAGE_IDS } from "../utilities/PageIDs";
import { Button, Col, Container, Row, Alert } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { HandIndexThumb } from "react-bootstrap-icons";

/* After the user clicks the "SignOut" link in the NavBar, log them out and display this page. */
const SignOut = () => {
  Meteor.logout();
  return (
    <Container id={PAGE_IDS.SIGN_OUT} className="py-3">
      <Row className="align-middle text-center">
        <Col className="d-flex flex-column justify-content-center">
          <Alert variant="warning">
            <h1>You have signed out!</h1>
          </Alert>
          <h2>Aircraft Phase Management System</h2>
          <p>Welcome to Aircraft Phase Lane Management System! </p>
          <p>
            Our user-friendly platform helps you streamline and monitor your
            aircraft's maintenance. Stay compliant and airworthy with our
            comprehensive approach.{" "}
          </p>
          <p>
            Trust us to keep your aircraft running smoothly and efficiently.
            Thank you for choosing our system!
          </p>
          <NavLink to="/signin" className="">
            <Button
              color="green"
              size="large"
              as={NavLink}
              exact
              to={"/signin"}
            >
              START HERE! <HandIndexThumb />
            </Button>
          </NavLink>
        </Col>
      </Row>
    </Container>
  );
};

export default SignOut;
