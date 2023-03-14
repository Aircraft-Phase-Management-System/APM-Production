import React from 'react';
import { Button, Container, Header } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

/** Render a Contact page page if the user wants to contact any of the Developers in from the team or reach out to us. */
class ContactUs extends React.Component {
  render() {
    const contactStyle = { marginLeft: '20px', marginRight: '20px' };
    return (
      <div className='background'>
        <Container className='information'>
          <br/>
          <Header as="h2" style={contactStyle}>
            Contact Us
            <hr/>
          </Header>
          <div style={contactStyle}>
            <p>Thank you for visiting the University of Hawaii at Manoa Students Club Association website.
              We exist to provide a voice and community for UH students. All current students can register a account in
            <Link to="/signup"> here </Link>
              .</p>
            <p>
              Please be aware we cannot provide assistance for academic matters. For these queries, please visit the
              <a target="_blank" href="https://manoa.hawaii.edu/about/contact/" rel="noreferrer"> UHM Contact Page</a>
            </p>

            <Header>If you would like to contact us, please email: jingzhef@hawaii.edu
            </Header>

            <Header>For Instructions and more details about the site, Please visit
              <a target="_blank" href="https://the-club-for-you.github.io/" rel="noreferrer"> Our Home page</a>
            </Header>
            <p>The website is still under development, please provide any issues encounted or suggestions. Thanks for building the club community better :)</p>
            <Button color='green' href="https://forms.gle/QNDnx35H4zPpbf486">Community Feedback</Button>
          </div>
          <br/>
        </Container>
      </div>
    );
  }
}

export default Contact;