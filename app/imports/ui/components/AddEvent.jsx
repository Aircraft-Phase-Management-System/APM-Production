import React, { useState } from "react";
import { Card, Col, Container, Row, Button } from "react-bootstrap";
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
        <AutoForm
          ref={(ref) => {
            fRef = ref;
          }}
          schema={bridge}
          onSubmit={(data) => submit(data, fRef)}
        >
          <Modal.Header closeButton>
          <Modal.Title as="h5">Add New Event</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container id={PAGE_IDS.ADD_EVENT} className="py-3">
              <TextField name="title" />
              <Row>
                <Col>
                  {" "}
                  <TextField name="start" />
                </Col>

                <Col>
                  <TextField name="end" />
                </Col>
              </Row>
              <Col></Col>
              <SelectField name="bgColor" />
              <SubmitField value="Submit" />
              <ErrorsField />
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
        </AutoForm>
      </Modal>
    </>
  );
};

export default AddEvent;
