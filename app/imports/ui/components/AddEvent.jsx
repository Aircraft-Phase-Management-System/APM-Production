import React, { useState } from "react";
import { Col, Container, Row, Button, Form, InputGroup } from "react-bootstrap";
import {
  AutoForm,
  ErrorsField,
  SelectField,
  SubmitField,
  TextField,
} from "uniforms-bootstrap5";
import swal from "sweetalert";
import { Meteor } from "meteor/meteor";
import SimpleSchema2Bridge from "uniforms-bridge-simple-schema-2";
import SimpleSchema from "simpl-schema";
import { Events } from "../../api/event_phase/EventCollection";
import { defineMethod } from "../../api/base/BaseCollection.methods";
import { PAGE_IDS } from "../utilities/PageIDs";
import Modal from "react-bootstrap/Modal";

// Create a schema to specify the structure of the data to appear in the form.
const formSchema = new SimpleSchema({
  title: String,
  start: String,
  end: String,
  bgColor: {
    type: String,
    allowedValues: ["#3788d8", "#17C8E7", "#17E7E1"],
    defaultValue: "#3788d8",
  },
});

const bridge = new SimpleSchema2Bridge(formSchema);

/* Renders the AddEvent page for adding a document. */
const AddEvent = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [validated, setValidated] = useState(false);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    console.log(event);
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
  };

  const onFormChange = (e) => {
    const value = e.target.value;
    console.log(value);
  };

  const onFormClick = (e) => {
    const value = e.target.value;
    console.log(value);
  };

  // On submit, insert the data.
  const submit = (data, formRef) => {
    const { title, end, start, bgColor } = data;
    const owner = Meteor.user().username;
    const collectionName = Events.getCollectionName();
    const definitionData = { title, start, end, bgColor, owner };
    defineMethod
      .callPromise({ collectionName, definitionData })
      .catch((error) => swal("Error", error.message, "error"))
      .then(() => {
        swal("Success", "Event added successfully", "success");
        formRef.reset();
      });
  };

  // Render the form. Use Uniforms: https://github.com/vazco/uniforms
  let fRef = null;
  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Add Event
      </Button>

      <Modal show={show} onHide={handleClose}>
        {/*<AutoForm
          ref={(ref) => {
            fRef = ref;
          }}
          schema={bridge}
          onSubmit={(data) => submit(data, fRef)}
        >*/}
        <Modal.Header closeButton>
          <Modal.Title as="h5">Add New Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container id={PAGE_IDS.ADD_EVENT} className="py-3">
            <Form ref={(ref) => {
            fRef = ref;
          }}
          schema={bridge}
          onSubmit={(data) => submit(data, fRef)} noValidate validated={validated} /*onSubmit={handleSubmit}*/>
              <Row className="mb-3">
                <Form.Group controlId="validationCustom01">
                  <Form.Label>Event Title</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    name="title"
                    placeholder="Ex: PMI 1"
                    onChange={onFormChange}
                  />
                  <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </Form.Group>
              </Row>

              <Row className="mb-3">
                <Form.Group as={Col} md="6" controlId="validationCustom02">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="text"
                    name="start"
                    placeholder="Ex: 2023-03-15"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid date.
                  </Form.Control.Feedback>
                </Form.Group>
                {/*
                <Form.Group as={Col} md="6" controlId="validationCustom03">
                  <Form.Label>Required Number of Days</Form.Label>
                  <Form.Control type="text" name="daysNum" placeholder="Ex: 20" required />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid number.
                  </Form.Control.Feedback>
                </Form.Group>
      */}
              </Row>

              <Row className="mb-3">
                <Button>Calculate Date</Button>
              </Row>

              <Row className="mb-3">
                <Form.Group>
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="text"
                    name="end"
                    placeholder="Ex: 2023-03-15"
                  />
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group>
                  <Form.Label>Event Color</Form.Label>
                  <Form.Control type="text" name="color" required />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid color.
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Button type="submit">Submit form</Button>
            </Form>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
        {/* </AutoForm> */}
      </Modal>
    </>
  );
};

export default AddEvent;
