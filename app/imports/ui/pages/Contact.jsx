import React from 'react';
import { Button, Container, Header } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

/** Render a Contact page page if the user wants to contact any of the Developers in from the team or reach out to us. */
class Contact extends React.Component {
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
            <p>Thank you for visiting the Aircraft Phase Management System.
              We exist to provide convienvent on managing phase lanes for the Aircraft community. All new users can register an account at
            <Link to="/signup"> here </Link>
              .</p>
            <p>
              Please be aware we cannot provide assistance for duties outside the Scheduler. 
              For these queries, please contact your supervisor directly or our sponsor Lt Dante Carrillo 
              (<a target='_blank' href=''>dante.carrillo01@gmail.com</a>) 
              for further assistance
            </p>

            {/*<Header>If you encounter to any bugs or issues and would like to contact us, please email: 
                (<a target='_blank' href=''>jingzhef@hawaii.edu </a>)  
                or 
                (<a target='_blank' href=''>acoa@hawaii.edu </a>) 
    </Header> */}

            <Header>For Instructions and more details about the site, Please visit
              <a target="_blank" href="http://ics-software-engineering.github.io/meteor-application-template-production/" rel="noreferrer"> Meteor-Application-Template-React</a>
            </Header>
            <div>
                <p>The website is still under development, feel free to provide any suggestions or report any issues encountered.</p>
                <p>Thanks for building the Aircraft community better :)</p>
            </div>

          </div>
          <br/>
        </Container>
      </div>
    );
  }
}

export default Contact;