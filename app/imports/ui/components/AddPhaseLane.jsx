import React, { useState } from "react";
import { Col, Container, Row, Button } from "react-bootstrap";
import {
  AutoForm,
  ErrorsField,
  HiddenField,
  SelectField,
  SubmitField,
  TextField,
} from "uniforms-bootstrap5";
import swal from "sweetalert";
import { Meteor } from "meteor/meteor";
import SimpleSchema2Bridge from "uniforms-bridge-simple-schema-2";
import SimpleSchema from "simpl-schema";
import { PlusSquare, XSquare } from "react-bootstrap-icons";
import { Phases } from "../../api/phase_lane/PhaseCollection";
import { defineMethod } from "../../api/base/BaseCollection.methods";
import { PAGE_IDS } from "../utilities/PageIDs";
import Modal from "react-bootstrap/Modal";

// Create a schema to specify the structure of the data to appear in the form.
const formSchema = new SimpleSchema({
  name: String,
  author: String,
  color: String,
  issue: String,
});

const bridge = new SimpleSchema2Bridge(formSchema);

function setBg() {
  //const randomColor = "#" + Math.floor(Math.random()*16777215).toString(16);
  const randomColor =
    "hsl(" +
    360 * Math.random() +
    "," +
    (20 + 60 * Math.random()) +
    "%," +
    (25 + 40 * Math.random()) +
    "%)";
  return randomColor;
}

/* Renders the AddEvent page for adding a document. */
const AddPhaseLane = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // On submit, insert the data.
  const submit = (data, formRef) => {
    const { name, author, color, issue } = data;
    console.log("color: ", color);
    const owner = Meteor.user().username;
    const collectionName = Phases.getCollectionName();
    const definitionData = { name, author, color, issue, owner };
    defineMethod
      .callPromise({ collectionName, definitionData })
      .catch((error) => swal("Error", error.message, "error"))
      .then(() => {
        swal("Success", "Phase Lane added successfully", "success");
        formRef.reset();
      });
  };

  // Render the form. Use Uniforms: https://github.com/vazco/uniforms
  let fRef = null;
  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        <PlusSquare />
        <Col>
          <p>ADD PHASE LANE</p>
        </Col>
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
            <Modal.Title as="h5">Add New Phase Lane</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container id={PAGE_IDS.ADD_PHASE_LANE} className="py-3">
              <Row>
                <Col>
                  <TextField
                    name="issue"
                    label="Issue Number"
                    placeholder="Ex: #1"
                  />
                </Col>
                <Col xs={8}>
                  <TextField
                    name="name"
                    label="Phase Lane Name"
                    placeholder="Ex: Flight Lane 1"
                  />
                </Col>
              </Row>
              <Row>
                <TextField
                  name="author"
                  label="Team"
                  placeholder="Ex: Team 1"
                />
              </Row>
              <HiddenField name="color" value={setBg()} />
              <ErrorsField />
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleClose}>
              <XSquare style={{ marginBottom: "4px", marginRight: "6px" }} />
              Close
            </Button>
            <SubmitField value="Save" onClick={handleClose} />
          </Modal.Footer>
        </AutoForm>
      </Modal>
    </>
  );
};

export default AddPhaseLane;
