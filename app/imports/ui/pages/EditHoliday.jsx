import React from "react";
import swal from "sweetalert";
import { Card, Col, Container, Row } from "react-bootstrap";
import {
  AutoForm,
  ErrorsField,
  HiddenField,
  NumField,
  SelectField,
  SubmitField,
  TextField,
} from "uniforms-bootstrap5";
import { useTracker } from "meteor/react-meteor-data";
import SimpleSchema2Bridge from "uniforms-bridge-simple-schema-2";
import { useParams } from "react-router";
import { Holidays } from "../../api/holiday/HolidayCollection";
import { updateMethod } from "../../api/base/BaseCollection.methods";
import LoadingSpinner from "../components/LoadingSpinner";
import { PAGE_IDS } from "../utilities/PageIDs";

const bridge = new SimpleSchema2Bridge(Holidays._schema);

/* Renders the EditHoliday page for editing a single document. */
const EditHoliday = () => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const { _id } = useParams();
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { doc, ready } = useTracker(() => {
    // Get access to Holiday documents.
    const subscription = Holidays.subscribeHoliday();
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the document
    const document = Holidays.findDoc(_id);
    return {
      doc: document,
      ready: rdy,
    };
  }, [_id]);

  // On successful submit, insert the data.
  const submit = (data) => {
    const { title, start } = data;
    const collectionName = Holidays.getCollectionName();
    const updateData = { id: _id, title, start };
    updateMethod
      .callPromise({ collectionName, updateData })
      .catch((error) => swal("Error", error.message, "error"))
      .then(() => swal("Success", "Item updated successfully", "success"));
  };

  return ready ? (
    <Container id={PAGE_IDS.EDIT_HOLIDAY} className="py-3">
      <Row className="justify-content-center">
        <Col xs={5}>
          <Col className="text-center">
            <h2>Edit Holiday</h2>
          </Col>
          <AutoForm
            schema={bridge}
            onSubmit={(data) => submit(data)}
            model={doc}
          >
            <Card>
              <Row>
                <Col sm="9">
                  <TextField
                    name="title"
                    label="Holiday's Name"
                    placeholder="Ex: Veteran's Day"
                  />
                </Col>
                <Col sm="3">
                  <TextField
                    name="start"
                    label="Date"
                    placeholder="Ex: YYYY-MM-DD"
                  />
                </Col>
                <SubmitField value="Submit" />
              </Row>
            </Card>
          </AutoForm>
        </Col>
      </Row>
    </Container>
  ) : (
    <LoadingSpinner />
  );
};

export default EditHoliday;
