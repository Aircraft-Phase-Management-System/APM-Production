import React, { useState } from "react";
import swal from "sweetalert";
import { useTracker } from "meteor/react-meteor-data";
import { Timeouts } from "../../api/timeout/TimeoutCollection";
import { EventsDay } from "../../api/event_day/EventDayCollection";
import { defineMethod } from "../../api/base/BaseCollection.methods";
import { COMPONENT_IDS } from "../utilities/ComponentIDs";
import { PAGE_IDS } from "../utilities/PageIDs";
import Modal from "react-bootstrap/Modal";
import { Formik } from "formik";
import * as yup from "yup";
import {
  Col,
  Container,
  Row,
  Button,
  Form,
  Alert,
  Card,
  Table,
  InputGroup,
} from "react-bootstrap";
import {
  XSquare,
  ExclamationDiamond,
  PlusSquare,
  ClockHistory,
  Save,
} from "react-bootstrap-icons";

const reload = () => window.location.reload();

const schema = yup.object().shape({
  day: yup.string().required(),
  title: yup.string().required(),
  start: yup.string().required(),
  end: yup.string().required(),
  min: yup.number().required(),
  type: yup.string().required(),
  ml1: yup.number().required(),
  ml2: yup.number().required(),
  ml3: yup.number().required(),
  section: yup.string().required(),
  remarks: yup.string().required(),
});

let eventDate = null;
let timeSpent = 0;
let startHour = null;
let endHour = null;

/* hours in manhours */
let hrsAvail = 0;
let hrsUsed = 0;
let hrsLeft = 0;
let isDateAHoliday = false;

/* Renders the AddEvent page for adding a document. */
const AddEventDay = ({ laneID, eventsDay }) => {
  laneID = laneID.issue;
  /* To open and close modal */
  const [show, setShow] = useState(false);
  const [buttonHide, setButtonHide] = useState(false);
  const handleClose = () => {
    setShow(false);
    setShowAlert(false);
    setButtonHide(true);
  };
  const handleShow = () => setShow(true);

  /* Show alert after providing start date and required number of days. */
  const [showAlert, setShowAlert] = useState(false);

  const { ready, timeouts } = useTracker(() => {
    const subscription = Timeouts.subscribeTimeout();
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the Stuff documents
    const timeoutItems = Timeouts.find({}, { sort: { title: 1 } }).fetch();

    return {
      timeouts: timeoutItems,
      ready: rdy,
    };
  }, []);

  /* Save value for date */
  const setEventDate = (e) => {
    eventDate = e.target.value;
  };

  /* Save value for the start hour. */
  const setStartHour = (e) => {
    if (e.target.value.length === 4) {
      startHour = e.target.value;
      console.log(startHour);
    }
  };

  /* Save value for the end hour. */
  const setEndHour = (e) => {
    if (e.target.value.length === 4) {
      endHour = e.target.value;
      console.log(endHour);
    }
    setTimeSpent();
  };

  /* Save value for number of hours. */
  const setTimeSpent = () => {
    if (endHour != null && startHour != null) {
      let end = endHour;
      let start = startHour;

      hour = (end - (end % 100)) / 100 - (start - (start % 100)) / 100;
      min = hour * 60 + (end % 100) - (start % 100);

      hour = Math.floor(min / 60);
      min = min % 60;

      /*timeSpent =
        (hour < 10 ? "0" + hour : hour) + "" + (min < 10 ? "0" + min : min);*/
      timeSpent = hour * 60 + min;
      console.log("timeSpent, ", timeSpent);
    }
  };

  /* Function to calculate how many manwork hours are available within the day. */
  const calcManWorkHrsAvailability = () => {
    let offHours = 0;
    let manHours = 0;

    isDateAHoliday = isDateHol();

    console.log("IsDateHol: ", isDateAHoliday);

    if (isDateAHoliday) {
      return;
    } else {
      hrsUsed = calcManWorkHrsUsed();
      hrsUsed = Math.round((hrsUsed + Number.EPSILON) * 100) / 100;
      console.log("hrsUsed: ", hrsUsed);

      /* get all the off hours for mahalo friday. */
      offHours = offHrs();

      if (offHours === 0) {
        manHours = 96;
      } else {
        manHours = 96 - offHours * 12;
      }
      console.log("manHours: ", manHours);

      /* hours in manhours */
      hrsAvail = manHours;
      hrsLeft = manHours - hrsUsed;
      hrsLeft = Math.round((hrsLeft + Number.EPSILON) * 100) / 100;
      console.log("hrsLeft: ", hrsLeft);
    }
  };

  /* Function to calculate how many manwork hours were are used in the day.  */
  const calcManWorkHrsUsed = () => {
    /* Only maintain the eventsDay that are equal to the input from the user. */
    const allSameDayEvents = _.filter(eventsDay, function (event) {
      return event.day === eventDate;
    });
    console.log("Same Day Events: ", allSameDayEvents);

    /* Sum all the time spent for the day. */
    const sumOfTimeSpent = _.reduce(
      allSameDayEvents,
      function (a, b) {
        return a + b.min;
      },
      0
    );
    console.log("Sum of Time Spent: ", sumOfTimeSpent);

    const sumAllML1s = _.reduce(
      allSameDayEvents,
      function (a, b) {
        return a + b.ml1;
      },
      0
    );
    const sumAllML2s = _.reduce(
      allSameDayEvents,
      function (a, b) {
        return a + b.ml2;
      },
      0
    );
    const sumAllML3s = _.reduce(
      allSameDayEvents,
      function (a, b) {
        return a + b.ml3;
      },
      0
    );
    const totalMLs = sumAllML1s + sumAllML2s + sumAllML3s;
    console.log("Total of MLs: ", totalMLs);

    return (sumOfTimeSpent * totalMLs) / 60 / 12;
  };

  /* Const to find the number of conflicting days for a holiday range. */
  const isDateHol = () => {
    const date = Date.parse(eventDate);

    /* Filter all the holidays to check if the parsed dates are the same. */
    const onlyHolidays = _.filter(timeouts, (timeout) => {
      return timeout.type === "Holiday";
    });

    /* Filter all the holidays that have a start and end day - more than one day. */
    const allHolsWithRng = _.filter(onlyHolidays, (holiday) => {
      return holiday.start.length === 10 && holiday.end.length === 10;
    });

    /* Filter all the single holidays that doesn't have a end date. */
    const allSingleHols = _.filter(onlyHolidays, (holiday) => {
      return holiday.start.length === 10 && holiday.end === "-";
    });

    /* Zip all the start and end days together for each holiday. */
    const holsRngDates = _.zip(
      _.pluck(allHolsWithRng, "start"),
      _.pluck(allHolsWithRng, "end")
    );

    console.log("Event Date: ", eventDate);

    /* Iterate over holidays with single of days (start only). */
    for (let i = 0; i < allSingleHols.length; i++) {
      /* Get the start and end dates of the current holiday. */
      const holDateCurrent = allSingleHols[i].start;
      console.log("holDateCurrent: ", holDateCurrent);

      if (eventDate === holDateCurrent) {
        return true;
      }
    }

    /* Iterate over holidays with a range of days (start and end). */
    for (let i = 0; i < holsRngDates.length; i++) {
      /* Get the start and end dates of the current holiday. */
      const holStartStr = holsRngDates[i][0];
      const holEndStr = holsRngDates[i][1];

      /* Convert to Date format. */
      const holStart = Date.parse(holStartStr);
      const holEnd = Date.parse(holEndStr);

      if (holStart <= date && date <= holEnd) {
        return true;
      }
    }

    return false;
  };

  const offHrs = () => {
    let mahaloHrs = 0;
    //let trainingHrs = 0;

    /* Filter the Mahalo Friday that occur in the same day. */
    const onlyMahaloDay = _.filter(timeouts, (timeout) => {
      return timeout.type === "Mahalo Day" && timeout.start === eventDate;
    });

    if (onlyMahaloDay.length != 0) {
      mahaloHrs = onlyMahaloDay[0].hours;
    }

    return mahaloHrs;
  };

  // On submit, insert the data.
  const submit = (data) => {
    const min = timeSpent;
    const { day, title, start, end, type, ml1, ml2, ml3, section, remarks } =
      data;
    const collectionName = EventsDay.getCollectionName();
    const definitionData = {
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
      laneID,
    };
    console.log("Definition Data: ", definitionData);
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
      <Button variant="outline-primary" size="sm" onClick={handleShow}>
        <PlusSquare></PlusSquare> Add New Event
      </Button>
      <Modal size="lg" show={show} onHide={handleClose} onExiting={reload}>
        <Modal.Header closeButton>
          <Modal.Title as="h5">Add New Event</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Container id={PAGE_IDS.ADD_EVENT_DAY} className="py-3">
            <Alert key={"info"} variant={"info"}>
              Click on the button <ClockHistory /> <b>Check Availability</b> to
              inspect how many hours are left for the day.
            </Alert>
            <Formik
              validationSchema={schema}
              onSubmit={submit}
              initialValues={{
                day: "",
                title: "",
                start: "",
                end: "",
                min: 0,
                type: "Planned",
                ml1: 0,
                ml2: 0,
                ml3: 0,
                section: " ",
                remarks: " ",
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
                    <Form.Group as={Col} md="4" controlId="validationFormik01">
                      <Form.Label>Event Date</Form.Label>
                      <InputGroup hasValidation>
                        <Form.Control
                          type="date"
                          name="day"
                          value={values.day}
                          onChange={(e) => {
                            setEventDate(e);
                            handleChange(e);
                          }}
                          isInvalid={!!errors.day}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.day}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>

                    <Form.Group as={Col} md="8" controlId="validationFormik02">
                      <Form.Label>Event Title</Form.Label>
                      <InputGroup hasValidation>
                        <Form.Control
                          type="text"
                          name="title"
                          placeholder="Ex: INSTALL WINDOW"
                          value={values.title}
                          onChange={handleChange}
                          isInvalid={!!errors.title}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.title}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>
                  </Row>

                  <Container className="calc-hours-left-container">
                    <Row className="mb-3">
                      <Form.Group
                        as={Col}
                        md="4"
                        controlId="validationFormik03"
                      >
                        <Form.Label>Start Hour</Form.Label>
                        <InputGroup hasValidation>
                          <Form.Control
                            type="text"
                            name="start"
                            placeholder="Ex: 0900"
                            value={values.start}
                            onChange={(e) => {
                              setStartHour(e);
                              handleChange(e);
                            }}
                            isInvalid={!!errors.start}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.start}
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>

                      <Form.Group
                        as={Col}
                        md="4"
                        controlId="validationFormik05"
                      >
                        <Form.Label>End Hour</Form.Label>
                        <InputGroup hasValidation>
                          <Form.Control
                            type="text"
                            name="end"
                            placeholder="Ex: 0930"
                            value={values.end}
                            onChange={(e) => {
                              setEndHour(e);
                              handleChange(e);
                            }}
                            isInvalid={!!errors.end}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.end}
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                    </Row>

                    <Row className="mb-3">
                      {!isDateAHoliday
                        ? availableHours(showAlert, setShowAlert)
                        : foundHoliday(showAlert, setShowAlert)}
                      {!showAlert &&
                      !buttonHide &&
                      eventDate &&
                      startHour &&
                      endHour ? (
                        <Row>
                          <div>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => {
                                calcManWorkHrsAvailability();
                                setShowAlert(true);
                              }}
                            >
                              <ClockHistory /> Check Availability
                            </Button>
                          </div>
                        </Row>
                      ) : (
                        <hr />
                      )}
                    </Row>
                  </Container>

                  {/* ML1, ML2 and ML3 Row*/}
                  <Row className="mb-3">
                    <Form.Group as={Col} controlId="validationFormik06">
                      <Form.Label>ML1</Form.Label>
                      <Form.Control
                        type="number"
                        name="ml1"
                        min={0}
                        value={values.ml1}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <Form.Group as={Col} controlId="validationFormik07">
                      <Form.Label>ML2</Form.Label>
                      <Form.Control
                        type="number"
                        name="ml2"
                        min={0}
                        value={values.ml2}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <Form.Group as={Col} controlId="validationFormik08">
                      <Form.Label>ML3</Form.Label>
                      <Form.Control
                        type="number"
                        name="ml3"
                        min={0}
                        value={values.ml3}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Row>

                  {/* Type and Section Row*/}
                  <Row className="mb-3">
                    <Form.Group as={Col} controlId="validationFormik09">
                      <Form.Label>Event Type</Form.Label>
                      <Form.Select name="type" onChange={handleChange}>
                        <option value="Planned">Planned</option>
                        <option value="Unexpected">Unexpected</option>
                        <option value="Plan ">Plan Incurred</option>
                      </Form.Select>
                    </Form.Group>
                    <Form.Group as={Col} controlId="validationFormik10">
                      <Form.Label>Aircraft Section</Form.Label>
                      <Form.Control
                        type="text"
                        name="section"
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Row>

                  <Row>
                    <Form.Group as={Col} controlId="validationFormik11">
                      <Form.Label>Remarks</Form.Label>
                      <Form.Control
                        type="text"
                        name="remarks"
                        placeholder="Relevant information about the event."
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Row>

                  <br />
                  <Button variant="success" type="submit">
                    <Save /> Save
                  </Button>
                </Form>
              )}
            </Formik>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            <XSquare style={{ marginBottom: "4px", marginRight: "6px" }} />
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

/* ALERT: Found available hours. */
function availableHours(showAlert, setShowAlert) {
  return (
    <Alert style={{ backgroundColor: "#84B498" }} show={showAlert}>
      <>
        <Alert.Heading>
          <ExclamationDiamond /> Event Report
        </Alert.Heading>
        <p>We found available hours on {eventDate}!</p>
        <Card>
          <Card.Header>Total Amount of Available Man-hours: </Card.Header>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Hours Used</th>
                <th>
                  Hours Available{hrsAvail != 96 ? " (Mahalo Friday)" : ""}
                </th>
                <th>Hours Left</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{hrsUsed}</td>
                <td>{hrsAvail}</td>
                <td>{hrsLeft}</td>
              </tr>
            </tbody>
          </Table>
          <Card.Footer>
            <p>Amount of time requested: {timeSpent} (mins).</p>
          </Card.Footer>
        </Card>

        <hr />
      </>

      <div className="d-flex justify-content-end">
        <Button onClick={() => setShowAlert(false)} variant="primary">
          Close
        </Button>
      </div>
    </Alert>
  );
}

/* ALERT: Found Holiday. */
function foundHoliday(showAlert, setShowAlert) {
  return (
    <Alert style={{ backgroundColor: "#CC3E35" }} show={showAlert}>
      <>
        <Alert.Heading>
          <ExclamationDiamond /> Event Report
        </Alert.Heading>
        <p style={{ color: "white" }}>
          The date {eventDate} is a holiday! Click{" "}
          <a href={"/total-timeouts"}>here</a> to see all the holidays.
        </p>

        <hr />
      </>

      <div className="d-flex justify-content-end">
        <Button onClick={() => setShowAlert(false)} variant="primary">
          Close
        </Button>
      </div>
    </Alert>
  );
}

export default AddEventDay;
