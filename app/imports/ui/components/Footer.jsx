import React from "react";
import { Container, Col, Image, Row } from "react-bootstrap";
import { EnvelopeAtFill } from "react-bootstrap-icons";

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
const Footer = () => {
  const divStyle = { paddingTop: "15px", marginBottom: "10px" };
  return (
    <footer className="mt-auto bg-lig ht">
      <Container style={divStyle}>
        <Row>
          <Col xs={2}>
            <Image src="/images/logo.png" width="110px" />
          </Col>
          <Col xs={8} className="text-center">
            209th Aviation Support Battalion <br />
            1129 Wright Ave, Wahiawa, HI <br />
            <a href="/contact">
              <EnvelopeAtFill style={{ marginBottom: 4 }} /> Contact Us{" "}
            </a>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
