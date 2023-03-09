import React, { useState } from "react";
import swal from "sweetalert";
import { PencilFill, XSquare, Download } from "react-bootstrap-icons";
import { Card, Col, Container, Row, Modal, Button } from "react-bootstrap";
import {
  AutoForm,
  ErrorsField,
  HiddenField,
  SubmitField,
  TextField,
  SelectField,
} from "uniforms-bootstrap5";
import { useTracker } from "meteor/react-meteor-data";
import SimpleSchema2Bridge from "uniforms-bridge-simple-schema-2";
import { Phases } from "../../api/phase_lane/PhaseCollection";
import { updateMethod } from "../../api/base/BaseCollection.methods";
import LoadingSpinner from "../components/LoadingSpinner";
import { PAGE_IDS } from "../utilities/PageIDs";

const bridge = new SimpleSchema2Bridge(Phases._schema);

/* Renders the EditHoliday page for editing a single document. */
const EditPhaseLane = ({ phase }) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  //const { _id } = useParams();
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { doc, ready } = useTracker(() => {
    // Get access to Holiday documents.
    const subscription = Phases.subscribePhase();
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the document
    const document = Phases.findDoc(phase._id);
    return {
      doc: document,
      ready: rdy,
    };
  }, [phase._id]);

  // On successful submit, insert the data.
  const submit = (data) => {
    const { name, author, color, issue } = data;
    const collectionName = Phases.getCollectionName();
    const updateData = { id: phase._id, name, author, color, issue };
    updateMethod
      .callPromise({ collectionName, updateData })
      .catch((error) => swal("Error", error.message, "error"))
      .then(() =>
        swal("Success", "Phase Lane updated successfully", "success")
      );
  };

  return ready ? (
    <>
      <Button variant="outline-secondary" size="sm" onClick={handleShow}>
        <PencilFill />
      </Button>

      <Modal show={show} onHide={handleClose}>
        <AutoForm schema={bridge} onSubmit={(data) => submit(data)} model={doc}>
          <Modal.Header closeButton>
            <Modal.Title as="h5">Edit Phase Lane</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container id={PAGE_IDS.EDIT_PHASE_LANE} className="py-3">
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
              <SelectField name="color" />
              <ErrorsField />
              <HiddenField name="owner" />
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleClose}>
              <XSquare style={{ marginBottom: "4px", marginRight: "6px" }} />
              Close
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

export default EditPhaseLane;
