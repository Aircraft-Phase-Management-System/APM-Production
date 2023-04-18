import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import {
  AutoForm,
  DateField,
  ErrorsField,
  NumField,
  SelectField,
  SubmitField,
  TextField,
} from "uniforms-bootstrap5";
import swal from "sweetalert";
import SimpleSchema2Bridge from "uniforms-bridge-simple-schema-2";
import SimpleSchema from "simpl-schema";
import { Timeouts } from "../../api/timeout/TimeoutCollection";
import { defineMethod } from "../../api/base/BaseCollection.methods";
import { PAGE_IDS } from "../utilities/PageIDs";
import { PlusSquare } from "react-bootstrap-icons";

export const timeoutTypes = ["Holiday", "Training Day", "Mahalo Day"];

// Create a schema to specify the structure of the data to appear in the form.
const formSchema = new SimpleSchema({
  title: String,
  start: String,
  end: { type: String, optional: true },
  type: { type: String, allowedValues: timeoutTypes, defaultValue: "Holiday" },
  hours: { type: Number, defaultValue: 0 },
});

const bridge = new SimpleSchema2Bridge(formSchema);

/* Renders the AddTimeout page for adding a document. */
const AddTimeout = () => {
  // On submit, insert the data.
  const submit = (data, formRef) => {
    let { title, start, end, type, hours } = data;

    // Format the data 
    start = moment(start).format("YYYY-MM-DD");
    end = end != undefined ? moment(end).format("YYYY-MM-DD") + " 15:00:00" : "-";
    
    const collectionName = Timeouts.getCollectionName();
    const definitionData = { title, start, end, type, hours };
    defineMethod
      .callPromise({ collectionName, definitionData })
      .catch((error) => swal("Error", error.message, "error"))
      .then(() => {
        swal("Success", "Timeout added successfully", "success");
        formRef.reset();
      });
  };

  // Render the form. Use Uniforms: https://github.com/vazco/uniforms
  let fRef = null;
  return (
    <Container id={PAGE_IDS.ADD_TIMEOUT} className="py-3">
      <Card className="card-non-working-days">
        <Card.Title>
          <PlusSquare /> Insert A New Timeout
        </Card.Title>
        <AutoForm
          ref={(ref) => {
            fRef = ref;
          }}
          schema={bridge}
          onSubmit={(data) => submit(data, fRef)}
        >
          <Row>
            <Col sm="6">
              <TextField
                name="title"
                label="Name"
                placeholder="Ex: Veteran's Day"
              />
            </Col>
            <Col sm="6">
              <SelectField name="type" label="Type" />
            </Col>
          </Row>
          <Row>
            <Col sm="4">
              <DateField name="start" label="Start Date" />
            </Col>
            <Col sm="4">
              <DateField name="end" label="End Date" />
            </Col>
            <Col sm="4">
              <NumField
                name="hours"
                label="Hours Out"
                decimal={null}
                min={0}
                placeholder="How many unavailable hours?"
              />
            </Col>
            <SubmitField value="Submit" />
          </Row>
          <ErrorsField />
        </AutoForm>
      </Card>
    </Container>
  );
};

export default AddTimeout;
