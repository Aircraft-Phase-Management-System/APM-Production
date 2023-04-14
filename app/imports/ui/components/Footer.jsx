import React from 'react';
import { Container, Col, Image } from 'react-bootstrap';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
const Footer = () => {
  const divStyle = { paddingTop: '15px' };
  return (
    <footer className="mt-auto bg-lig ht">
      <Container style={divStyle}>
        <Col className="text-center">
          Department of Information and Computer Sciences <br />
          University of Hawaii<br />
          Honolulu, HI 96822 <br />
          <a href="http://ics-software-engineering.github.io/meteor-application-template-production">Template Home Page</a>
        </Col>
        <Image src="/images/logo.png" width="300px" />
      </Container>
    </footer>
  );
};

export default Footer;
