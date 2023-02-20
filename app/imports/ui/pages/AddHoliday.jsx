import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import {
  AutoForm,
  ErrorsField,
  NumField,
  SelectField,
  SubmitField,
  TextField,
} from "uniforms-bootstrap5";
import swal from "sweetalert";
import { Meteor } from "meteor/meteor";
import SimpleSchema2Bridge from "uniforms-bridge-simple-schema-2";
import SimpleSchema from "simpl-schema";
import { Holidays } from "../../api/holiday/HolidayCollection";
import { defineMethod } from "../../api/base/BaseCollection.methods";
import { PAGE_IDS } from "../utilities/PageIDs";

// Create a schema to specify the structure of the data to appear in the form.
const formSchema = new SimpleSchema({
  title: String,
  start: String,
});

const bridge = new SimpleSchema2Bridge(formSchema);

/* Renders the AddStuff page for adding a document. */
const AddHoliday = () => {
  // On submit, insert the data.
  const submit = (data, formRef) => {
    const { title, start } = data;
    const owner = Meteor.user().username;
    const collectionName = Holidays.getCollectionName();
    const definitionData = { title, start, owner };
    defineMethod
      .callPromise({ collectionName, definitionData })
      .catch((error) => swal("Error", error.message, "error"))
      .then(() => {
        swal("Success", "Holiday added successfully", "success");
        formRef.reset();
      });
  };

  // Render the form. Use Uniforms: https://github.com/vazco/uniforms
  let fRef = null;
  return (
    <Container id={PAGE_IDS.ADD_HOLIDAY} className="py-3">
      <Card className="card-non-working-days">
        <Card.Title>INSERT A NEW HOLIDAY</Card.Title>
      <AutoForm
        ref={(ref) => {
          fRef = ref;
        }}
        schema={bridge}
        onSubmit={(data) => submit(data, fRef)}
      >
        <Row>
          <Col sm="9">
            <TextField name="title" label="Holiday's Name" placeholder="Ex: Veteran's Day" />
          </Col>
          <Col sm="3">
            <TextField name="start" label="Date" placeholder="Ex: YYYY-MM-DD" />
          </Col>
            <SubmitField value="Submit" />
        </Row>

        <ErrorsField />
      </AutoForm>
      </Card>
    </Container>
  );
};

export default AddHoliday;
