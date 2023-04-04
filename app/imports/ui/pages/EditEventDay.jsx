import React, { useState } from "react";
import swal from "sweetalert";
import { PencilFill, XSquare, Download, Trash } from "react-bootstrap-icons";
import { Col, Container, Row, Modal, Button } from "react-bootstrap";
import {
  AutoForm,
  ErrorsField,
  SubmitField,
  TextField,
  SelectField,
  DateField,
  NumField,
  LongTextField,
} from "uniforms-bootstrap5";
import { useTracker } from "meteor/react-meteor-data";
import SimpleSchema2Bridge from "uniforms-bridge-simple-schema-2";
import { EventsDay } from "../../api/event_day/EventDayCollection";
import { updateMethod } from "../../api/base/BaseCollection.methods";
import { removeItMethod } from "../../api/base/BaseCollection.methods";
import LoadingSpinner from "../components/LoadingSpinner";
import { PAGE_IDS } from "../utilities/PageIDs";

const bridge = new SimpleSchema2Bridge(EventsDay._schema);

/* Renders the EditHoliday page for editing a single document. */
const EditEventDay = ({ event }) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  //const { _id } = useParams();
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { doc, ready } = useTracker(() => {
    // Get access to Holiday documents.
    const subscription = EventsDay.subscribeEventDay();
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the document
    const document = EventsDay.findDoc(event._id);
    return {
      doc: document,
      ready: rdy,
    };
  }, [event._id]);

  // On successful submit, insert the data.
  const submit = (data) => {
    const {
      day,
      title,
      start,
      end,
      min,
      type,
      ml1,
      ml2,
      ml3,
      section,
      remarks,
    } = data;
    const collectionName = EventsDay.getCollectionName();
    const updateData = {
      id: event._id,
      day,
      title,
      start,
      end,
      min,
      type,
      ml1,
      ml2,
      ml3,
      section,
      remarks,
    };
    updateMethod
      .callPromise({ collectionName, updateData })
      .catch((error) => swal("Error", error.message, "error"))
      .then(() => swal("Success", "Event updated successfully", "success"));
  };

  const handleDelete = () => {
    const collectionName = EventsDay.getCollectionName();
    const instance = EventsDay.findDoc(event._id);
    removeItMethod
      .callPromise({ collectionName, instance })
      .catch((error) => swal("Error", error.message, "error"))
      .then(() => {
        swal("Success", "Event deleted successfully", "success");
        handleClose();
      });
  };

  return ready ? (
    <>
      <Button variant="light" size="sm" onClick={handleShow}>
        <PencilFill />
      </Button>

      <Modal show={show} onHide={handleClose}>
        <AutoForm schema={bridge} onSubmit={(data) => submit(data)} model={doc}>
          <Modal.Header closeButton>
            <Modal.Title as="h5">Edit Event</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container id={PAGE_IDS.EDIT_EVENT_DAY} className="py-3">
              <Row>
                <Col>
                  <TextField name="day" label="Event Date" />
                </Col>
                <Col xs={8}>
                  <TextField
                    name="title"
                    label="Event Name"
                    placeholder="Ex: REMOVE ROBBIE TANK"
                  />
                </Col>
              </Row>

              <Row>
                <Col>
                  <TextField
                    name="start"
                    label="Start Hour"
                    placeholder="Ex: 1300"
                  />
                </Col>
                <Col>
                  <NumField
                    name="min"
                    label="Time Spent"
                    decimal={null}
                    min={0}
                  />
                </Col>
                <Col>
                  <TextField
                    name="end"
                    label="End Hour"
                    placeholder="Ex: 1340"
                  />
                </Col>
              </Row>

              <Row>
                <Col>
                  <NumField name="ml1" label="ML1" decimal={null} min={0} />
                </Col>
                <Col>
                  <NumField name="ml2" label="ML2" decimal={null} min={0} />
                </Col>
                <Col>
                  <NumField name="ml3" label="ML3" decimal={null} min={0} />
                </Col>
              </Row>

              <Row>
                <Col>
                  <SelectField name="type" label="Event Type" />
                </Col>
                <Col>
                  <TextField
                    name="section"
                    label="Section"
                    placeholder="Ex: 1-4"
                  />
                </Col>
              </Row>

              <Row>
                <LongTextField
                  name="remarks"
                  label="Additional Notes"
                  placeholder="Ex: NO TI"
                />
              </Row>
              <ErrorsField />
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="dark" onClick={handleClose}>
              <XSquare style={{ marginBottom: "4px", marginRight: "6px" }} />
              Close
            </Button>
            <Button variant="danger" onClick={handleDelete}>
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

export default EditEventDay;
