import React, { useState } from "react";
import { Col, Container, Row, Button, Form } from "react-bootstrap";
import { XSquare } from "react-bootstrap-icons";
import swal from "sweetalert";
import { Meteor } from "meteor/meteor";
import { Events } from "../../api/event_phase/EventCollection";
import { defineMethod } from "../../api/base/BaseCollection.methods";
import { PAGE_IDS } from "../utilities/PageIDs";
import Modal from "react-bootstrap/Modal";
import { Formik } from "formik";
import * as yup from "yup";
import Alert from "react-bootstrap/Alert";

let startDate = null;
let reqNumberDays = 0;
let calculatedEndDate = "";

/*
const holidays = [
  { start : "2023-12-25", end: "2023-12-29"}
];*/

const holidays = [{ start: "2023-12-25", end: "2023-12-27" }];

allStartHolidays = _.pluck(holidays, "start")[0];
allEndHolidays = _.pluck(holidays, "end")[0];

const schema = yup.object().shape({
  title: yup.string().required(),
  start: yup.string().required(),
  days: yup.number().required(),
  end: yup.string().required(),
  color: yup.string().required(),
});

/* Renders the AddEvent page for adding a document. */
const AddEvent = () => {
  /* To open and close modal */
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  /* Button for suggestion end date */
  const [showButton, setShowButton] = useState(false);
  const [showSuggestion, setSuggestion] = useState(false);

  const [endDate, setEndDate] = useState("");

  /* To calculate the end date */
  const setValsforCalc = (e) => {
    const date = e.target.value;
    const numberOfDays = e.target.valueAsNumber;

    if (date.length === 10) {
      startDate = date;
    }

    if (numberOfDays) {
      reqNumberDays = numberOfDays;
    }
  };

  const calculateEndDate = () => {
    if (startDate && reqNumberDays) {
      console.log(startDate);
      console.log(reqNumberDays);

      const curStartYear = parseInt(allStartHolidays.substring(0, 4));
      const curStartMonth = parseInt(allStartHolidays.substring(5, 7));
      const curStartDay = parseInt(allStartHolidays.substring(8));

      const curEndYear = parseInt(allEndHolidays.substring(0, 4));
      const curEndMonth = parseInt(allEndHolidays.substring(5, 7));
      const curEndDay = parseInt(allEndHolidays.substring(8));

      const startYear = parseInt(startDate.substring(0, 4));
      const startMonth = parseInt(startDate.substring(5, 7));
      const startDay = parseInt(startDate.substring(8));

      const daysOff = curEndDay - curStartDay + 1;

      if (
        startDay <= curStartDay &&
        curEndDay <= startDay + reqNumberDays - 1
      ) {
        setEndDate(startYear + "-" + startMonth + "-" + (startDay + reqNumberDays - 1 + daysOff))
        console.log(calculatedEndDate);
        suggEndDateReport(calculatedEndDate, allStartHolidays, daysOff);
      }

      setSuggestion(true);
    }
  };

  const suggEndDateReport = (endDate, holidaysIncluded, daysOff) => {
    setSuggestion(true);
  };

  console.log("udapte");

  // On submit, insert the data.
  const submit = (data) => {
    console.log(data);
    const { title, start, days, end, color } = data;
    const owner = Meteor.user().username;
    const collectionName = Events.getCollectionName();
    const definitionData = { title, start, days, end, color, owner };
    defineMethod
      .callPromise({ collectionName, definitionData })
      .catch((error) => swal("Error", error.message, "error"))
      .then(() => {
        swal("Success", "Event added successfully", "success");
      });
  };

  // Render the form. Use Uniforms: https://github.com/vazco/uniforms

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Add Event
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Formik
          validationSchema={schema}
          onSubmit={submit}
          initialValues={{
            title: "PMI 1000",
            start: "2023-05-12",
            days: 10,
            end: "2023-05-24",
            color: "Blue",
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
              <Modal.Header closeButton>
                <Modal.Title as="h5">Add New Event</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                <Container id={PAGE_IDS.ADD_EVENT} className="py-3">
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
                        onChange={(e) => {
                          setValsforCalc(e);
                          handleChange(e);
                        }}
                        isValid={touched.start && !errors.start}
                      />
                    </Form.Group>

                    <Form.Group as={Col} md="6" controlId="validationCustom03">
                      <Form.Label>Required Number of Days</Form.Label>
                      <Form.Control
                        type="number"
                        name="days"
                        placeholder="Ex: 20"
                        onChange={(e) => {
                          setValsforCalc(e);
                          handleChange(e);
                        }}
                        isValid={touched.days && !errors.days}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a valid number.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Row>

                  <Row className="mb-3">
                    <Alert show={showButton && showSuggestion} variant="warning">
                    { showSuggestion && endDate.length != 0 ? (<>
                      <Alert.Heading>We found 1 holiday(s) within the range!</Alert.Heading>
                      <p>Total of Non-Working Days (1)</p>
                      <p>From {allStartHolidays} to {allEndHolidays}</p>
                      <h6>Suggested End Date: {endDate}</h6>
                      <hr /></> ): (<p>Nothing Found!</p>) }
                      <div className="d-flex justify-content-end">
                        <Button
                          onClick={() => setShowButton(false)}
                          variant="outline-warning"
                        >
                          Close
                        </Button>
                      </div>
                    </Alert>

                    {!showButton && (
                      <Button onClick={() => {calculateEndDate(); showSuggestion? setShowButton(true) : setShowButton(false) }}>Calculate End Date</Button>
                    )}
                  </Row>

                  <Row className="mb-3">
                    <Form.Group controlId="validationFormik04">
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
                    <Form.Group controlId="validationFormik05">
                      <Form.Label>Event Color</Form.Label>
                      <Form.Control
                        type="text"
                        name="color"
                        onChange={handleChange}
                        isValid={touched.color && !errors.color}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.color}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Row>
                </Container>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="danger" onClick={handleClose}>
                  <XSquare
                    style={{ marginBottom: "4px", marginRight: "6px" }}
                  />
                  Close
                </Button>
                <Button variant="success" onClick={handleClose} type="submit">
                  Save
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
};

export default AddEvent;
