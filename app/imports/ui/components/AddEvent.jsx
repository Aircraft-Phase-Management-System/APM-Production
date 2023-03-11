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
import { Formik } from "formik";
import * as yup from "yup";

const schema = yup.object().shape({
  title: yup.string().required(),
  start: yup.string().required(),
  end: yup.string().required(),
  bgColor: yup.string().required(),
});

//const bridge = new SimpleSchema2Bridge(formSchema);

/* Renders the AddEvent page for adding a document. */
const AddEvent = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // const [validated, setValidated] = useState(false);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    console.log(form);
    /* if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);*/
  };

  const onFormChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    console.log(name);
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
      });
  };

  // Render the form. Use Uniforms: https://github.com/vazco/uniforms

  return (
    <Formik
      validationSchema={schema}
      onSubmit={submit}
      initialValues={{
        title: "Mark",
        start: "Otto",
        end: "hi",
        bgColor: "hi",
      }}
    >
      {({
        handleSubmit,
        handleChange,
        handleBlur,
        values,
        touched,
        isValid,
        errors,
      }) => (
        <Form noValidate onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Form.Group controlId="validationFormik01">
              <Form.Label>Event Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                placeholder="Ex: PMI 1"
                onChange={handleChange}
                isValid={touched.title && !errors.title}
              />
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} md="6" controlId="validationFormik02">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="text"
                name="start"
                placeholder="Ex: 2023-03-15"
                onChange={handleChange}
                isValid={touched.start && !errors.start}
              />
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
          {/*
                  <Row className="mb-3">
                    <Button>Calculate Date</Button>
    </Row>  */}

          <Row className="mb-3">
            <Form.Group controlId="validationFormik03">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                required
                type="text"
                name="end"
                placeholder="Ex: 2023-03-15"
                onChange={handleChange}
                isValid={touched.end && !errors.end}
              />
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group controlId="validationFormik04">
              <Form.Label>Event Color</Form.Label>
              <Form.Control
                type="text"
                name="bgColor"
                onChange={handleChange}
                isValid={touched.bgColor && !errors.bgColor}
              />
              <Form.Control.Feedback type="invalid">
                {errors.color}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Button type="submit">Submit form</Button>
        </Form>
      )}
    </Formik>
  );
};

export default AddEvent;
