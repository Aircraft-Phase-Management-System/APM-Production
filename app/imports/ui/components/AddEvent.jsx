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
let totalConflictOffDays = 0;
let conflictingRangesIndex = [];

const holidays = [
  { title: "New Year's Day", start: "2023-12-30", end: "2024-01-03" },
  { title: "Independece Day", start: "2023-07-04", end: null },
  { title: "Veterans Dar", start: "2023-11-11", end: null },
  { title: "Christmas Day", start: "2023-12-25", end: "2023-12-27" },
];

const allStartHolidays = _.pluck(holidays, "start");
const allEndHolidays = _.pluck(holidays, "end");

console.log(allStartHolidays);
console.log(allEndHolidays);

const allDatesRange = _.zip(allStartHolidays, allEndHolidays);

const schema = yup.object().shape({
  title: yup.string().required(),
  start: yup.string().required(),
  days: yup.number().required(),
  end: yup.string().required(),
  color: yup.string().required(),
});

/* Renders the AddEvent page for adding a document. */
const AddEvent = () => {
  //console.log(holidays);
  /* To open and close modal */
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  /* Show alert after providing start date and required number of days. */
  const [showAlert, setShowAlert] = useState(false);
  /* Show suggestion if a non-working days was found.  */
  const [showSuggestion, setSuggestion] = useState(false);
  /* Save the suggestion date after found.  */
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
    /* Received inputs from the user using the form */
    const strRecvStartYear = startDate.substring(0, 4);
    const strRecvStartMonth = startDate.substring(5, 7);
    const strRecvStartDay = startDate.substring(8);

    const recvStartYear = parseInt(strRecvStartYear);
    const recvStartMonth = parseInt(strRecvStartMonth);
    const recvStartDay = parseInt(strRecvStartDay);

    /* Calculate possible end date */
    const calcDay = recvStartDay + reqNumberDays - 1;
    console.log("Calc Day: ", calcDay);
    let monthDays = checkMonthDays(recvStartMonth);
    let possEndDate = null;

    if (monthDays < calcDay) {
      /* TODO: Move to next month. */
    } else {
      possEndDate = recvStartYear + "-" + recvStartMonth + "-" + calcDay;
    }

    console.log("Start Date", startDate);
    console.log("Possible End Date", possEndDate);

    /* Transform into date formart the start date from the and calculated possEnd end date. */
    startDate = Date.parse(startDate);
    possEndDate = Date.parse(possEndDate);

    const numOffDays = allDatesRange.length;

    /* Loop through all the ranges of the off days*/
    for (let offDay = 0; offDay < numOffDays; offDay++) {
      let curStart = allDatesRange[offDay][0];
      let curEnd = allDatesRange[offDay][1];

      const curStartYear = parseInt(curStart.substring(0, 4));
      const curStartMonth = parseInt(curStart.substring(5, 7));
      const curStartDay = parseInt(curStart.substring(8));

      /* If the there is only one off day (not a range) */
      if (!curEnd) {
        /* TO DO */
        curStart = Date.parse(curStart);
        curEnd = Date.parse(curEnd);

        if (curStart >= startDate && curStart <= possEndDate) {
          console.log("1 OFF Day");
          conflictingRangesIndex.push(offDay);
          totalConflictOffDays++;

          setEndDate(
            strRecvStartYear +
              "-" +
              strRecvStartMonth +
              "-" +
              (calcDay + 1) + " " + " 15:50:00"
          );
          console.log(
            strRecvStartYear +
              "-" +
              strRecvStartMonth +
              "-" +
              (calcDay + 1) + " " + " 15:50:00"
          );
          setSuggestion(true);
        }

        /* If it is a range of off days */
      } else {
        /* Only get day, month, and year of current off day if end exists (a range exist) */
        const curEndYear = parseInt(curEnd.substring(0, 4));
        const curEndMonth = parseInt(curEnd.substring(5, 7));
        const curEndDay = parseInt(curEnd.substring(8));
        const curOffDays = Math.abs(curEndDay - curStartDay) + 1;

        curStart = Date.parse(curStart);
        curEnd = Date.parse(curEnd);

        /* If current days off takes place within event range */
        if (
          curStart >= startDate &&
          curStart <= possEndDate &&
          curEnd >= startDate &&
          curEnd <= possEndDate
        ) {
          conflictingRangesIndex.push(offDay);
          //console.log(conflictingRangesIndex);

          /* if the current start month is not the same as the end month */
          if (curStartMonth != curEndMonth) {
            let curMonthDays = checkMonthDays(curStartMonth);
            let otherMonOffDays = curMonthDays - curStartDay + 1 + curEndDay;
            totalConflictOffDays += otherMonOffDays;
          } else {
            totalConflictOffDays += curOffDays;
          }
          console.log(totalConflictOffDays);

          setEndDate(
            recvStartYear +
              "-" +
              recvStartMonth +
              "-" +
              (recvStartDay + reqNumberDays - 1 + curOffDays) + " " + " 15:50:00"
          );
          setSuggestion(true);
          console.log("LOOP 1");

          /* If current start off day is within  */
        } else if (curStart >= startDate && curStart <= possEndDate) {
          /* TODO */
          conflictingRangesIndex.push(offDay);
          setSuggestion(true);
          console.log("LOOP 2");

          /* If possible calculated date is within off day range */
        } else if (curEnd >= startDate && curEnd <= possEndDate) {
          /* TODO */
          let dayDiffLeft = possEndDate - curStartDay;
          conflictingRangesIndex.push(offDay);
          setSuggestion(true);
          console.log("LOOP 3");
        }
      }
    }
  };

  function checkMonthDays(monthStr) {
    let monthDays = 0;
    /* If month is Feb, 28 days. */
    if (monthStr === "02") {
      monthDays = 28;

      /* If month is April, June, September, or November. 30 days. */
    } else if (
      monthStr === "04" ||
      monthStr === "06" ||
      monthStr === "09" ||
      monthStr === "11"
    ) {
      monthDays = 30;

      /* January, March, May, July, August, October, and December. 31 days */
    } else {
      monthDays = 31;
    }

    return monthDays;
  }

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
                    <Alert show={showAlert} variant="warning">
                      {showSuggestion ? (
                        <>
                          <Alert.Heading>
                            Alert: We found conflicting non-working days within
                            the range!
                          </Alert.Heading>
                          <p>
                            Total of {totalConflictOffDays} Non-Working Day(s)
                          </p>
                          {allDatesRange[conflictingRangesIndex[0]][1] !=
                          null ? (
                            <p>
                              From {allDatesRange[conflictingRangesIndex[0]][0]}{" "}
                              to {allDatesRange[conflictingRangesIndex[0]][1]}
                            </p>
                          ) : (
                            <p>
                              Date:{" "}
                              {allDatesRange[conflictingRangesIndex[0]][0]}
                            </p>
                          )}
                          <h6>Suggested End Date: {endDate}</h6>
                          <hr />
                        </>
                      ) : (
                        <p>Nothing Found!</p>
                      )}
                      <div className="d-flex justify-content-end">
                        <Button
                          onClick={() => setShowAlert(false)}
                          variant="outline-warning"
                        >
                          Close
                        </Button>
                      </div>
                    </Alert>
                    {!showAlert && startDate && reqNumberDays != 0 ? (
                      <Button
                        onClick={() => {
                          calculateEndDate();
                          setShowAlert(true);
                        }}
                      >
                        Calculate End Date
                      </Button>
                    ) : (
                      <hr />
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
