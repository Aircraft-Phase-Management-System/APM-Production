import React, { useState } from "react";
import swal from "sweetalert";
import { PencilFill, XSquare, ExclamationOctagon, Trash } from "react-bootstrap-icons";
import { Col, Container, Row, Modal, Button, Alert } from "react-bootstrap";
import {
  AutoForm,
  ErrorsField,
  HiddenField,
  SubmitField,
  TextField,
  SelectField,
  NumField,
} from "uniforms-bootstrap5";
import { useTracker } from "meteor/react-meteor-data";
import SimpleSchema2Bridge from "uniforms-bridge-simple-schema-2";
// import { useParams } from "react-router";
import { Timeouts } from "../../api/timeout/TimeoutCollection";
import { updateMethod } from "../../api/base/BaseCollection.methods";
import { removeItMethod } from "../../api/base/BaseCollection.methods";

import LoadingSpinner from "../components/LoadingSpinner";
import { PAGE_IDS } from "../utilities/PageIDs";

const bridge = new SimpleSchema2Bridge(Timeouts._schema);

/* Renders the EditTimeout page for editing a single document. */
const EditTimeout = ({ timeout }) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  //const { _id } = useParams();
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { doc, ready } = useTracker(() => {
    // Get access to Timeout documents.
    const subscription = Timeouts.subscribeTimeout();
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the document
    const document = Timeouts.findDoc(timeout._id);
    return {
      doc: document,
      ready: rdy,
    };
  }, [timeout._id]);

  // On successful submit, insert the data.
  const submit = (data) => {
    const { title, start, end, type, hours } = data;
    const collectionName = Timeouts.getCollectionName();
    const updateData = { id: timeout._id, title, start, end, type, hours };
    updateMethod
      .callPromise({ collectionName, updateData })
      .catch((error) => swal("Error", error.message, "error"))
      .then(() => swal("Success", "Date updated successfully", "success"));
  };

  const handleDelete = () => {
    const confirmed = window.confirm('Are you sure you want to delete this Timeout?');
  if (confirmed) {
    const collectionName = Timeouts.getCollectionName();
    const instance = Timeouts.findDoc(timeout._id);
    console.log(timeout._id)
    console.log(instance)
    removeItMethod
      .callPromise({ collectionName, instance })
      .catch((error) => swal("Error", error.message, "error"))
      .then(() => {
        swal("Success", "Timeout deleted successfully", "success");
        handleClose();
      });
      
  };
}

  return ready ? (
    <>
      <div className="d-grid gap-2">
        <Button variant="primary" size="sm" onClick={handleShow}>
          <PencilFill />
        </Button>
      </div>

      <Modal show={show} onHide={handleClose}>
        <AutoForm schema={bridge} onSubmit={(data) => submit(data)} model={doc}>
          <Modal.Header closeButton>
            <Modal.Title as="h5" centered>
              Edit Timeout
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container id={PAGE_IDS.EDIT_TIMEOUT} className="py-3">
              <Alert key="warning" variant="warning">
                <ExclamationOctagon /> Include an end date for a holiday range.
              </Alert>
              <TextField
                name="title"
                label="Title"
                placeholder="Ex: Veteran's Day"
              />
              <Row>
                <Col>
                  <TextField
                    name="start"
                    label="Start Date"
                    placeholder="Ex: YYYY-MM-DD"
                  />
                </Col>
                <Col>
                  <TextField
                    name="end"
                    label="End Date"
                    placeholder="Ex: YYYY-MM-DD"
                  />
                </Col>
              </Row>
              <Row>
                <Col sm={8}>
                  <SelectField name="type" label="Select Type" />
                </Col>
                <Col>
                  <NumField
                    name="hours"
                    label="Required Hours"
                    decimal={null}
                    min={0}
                    placeholder="How many unavailable hours?"
                  />
                </Col>
              </Row>
              <ErrorsField />
              <HiddenField name="owner" />
            </Container>
          </Modal.Body>
          <Modal.Footer>
          <Button variant="dark" onClick={handleClose}>
              <XSquare style={{ marginBottom: "4px", marginRight: "6px" }} />
              Close
            </Button>
            <Button variant="danger" onClick={handleDelete} >
              <Trash style={{ marginBottom: "4px", marginRight: "6px" }} />
              Delete
            </Button>
            <SubmitField value="Save Changes" onClick={handleClose} />
          </Modal.Footer>
        </AutoForm>
      </Modal>
    </>
  ) : (
    <LoadingSpinner />
  );
};

export default EditTimeout;
