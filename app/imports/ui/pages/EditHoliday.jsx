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
} from "uniforms-bootstrap5";
import { useTracker } from "meteor/react-meteor-data";
import SimpleSchema2Bridge from "uniforms-bridge-simple-schema-2";
// import { useParams } from "react-router";
import { Holidays } from "../../api/holiday/HolidayCollection";
import { updateMethod } from "../../api/base/BaseCollection.methods";
import LoadingSpinner from "../components/LoadingSpinner";
import { PAGE_IDS } from "../utilities/PageIDs";

const bridge = new SimpleSchema2Bridge(Holidays._schema);

/* Renders the EditHoliday page for editing a single document. */
const EditHoliday = ({ holiday }) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  //const { _id } = useParams();
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { doc, ready } = useTracker(() => {
    // Get access to Holiday documents.
    const subscription = Holidays.subscribeHoliday();
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the document
    const document = Holidays.findDoc(holiday._id);
    return {
      doc: document,
      ready: rdy,
    };
  }, [holiday._id]);

  // On successful submit, insert the data.
  const submit = (data) => {
    const { title, start } = data;
    const collectionName = Holidays.getCollectionName();
    const updateData = { id: holiday._id, title, start };
    updateMethod
      .callPromise({ collectionName, updateData })
      .catch((error) => swal("Error", error.message, "error"))
      .then(() => swal("Success", "Date updated successfully", "success"));
  };

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
            <Modal.Title as="h5">Modify Holiday</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container id={PAGE_IDS.EDIT_HOLIDAY} className="py-3">
              <TextField
                name="title"
                label="Name"
                placeholder="Ex: Veteran's Day"
              />
              <TextField
                name="start"
                label="Date"
                placeholder="Ex: YYYY-MM-DD"
              />
              <ErrorsField />
              <HiddenField name="owner" />
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleClose}>
              <XSquare style={{marginBottom: '4px', marginRight: '6px'}}/>Close
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

export default EditHoliday;
