import React, { useState } from "react";
import {
  Col,
  Container,
  Row,
  Button,
  Form,
  Alert,
  Card,
  Table,
} from "react-bootstrap";
import {
  XSquare,
  ExclamationDiamond,
  PlusSquare,
  ClockHistory,
} from "react-bootstrap-icons";
import swal from "sweetalert";
import { useTracker } from "meteor/react-meteor-data";
import { Timeouts } from "../../api/timeout/TimeoutCollection";
import { Meteor } from "meteor/meteor";
import { EventsDay } from "../../api/event_day/EventDayCollection";
import { defineMethod } from "../../api/base/BaseCollection.methods";
import { PAGE_IDS } from "../utilities/PageIDs";
import Modal from "react-bootstrap/Modal";
import { Formik } from "formik";
import * as yup from "yup";

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

/* Renders the AddEvent page for adding a document. */
const AddEventDay = ({ laneID, eventsDay }) => {
  /* To open and close modal */
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  /* Show alert after providing start date and required number of days. */
  const [showAlert, setShowAlert] = useState(false);
  /* Show suggestion if a non-working days was found.  */
  const [showSuggestion, setSuggestion] = useState(false);
  /* Save the suggestion date after found.  */

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

  const allStartTimeouts = _.pluck(timeouts, "start");
  const allEndTimeouts = _.pluck(timeouts, "end");

  const allDatesRange = _.zip(allStartTimeouts, allEndTimeouts);

  /* Save value for date */
  const setEventDate = (e) => {
    eventDate = e.target.value;
  };

  /* Save value for the start hour. */
  const setStartHour = (e) => {
    if (e.target.value.length === 4) {
      startHour = e.target.value;
    }
  };

  /* Save value for number of hours. */
  const setTimeSpent = (e) => {
    if (e.target.value.length >= 2) {
      timeSpent = e.target.valueAsNumber;
    }
  };

  /* Save value for the end hour. */
  const setEndHour = (e) => {
    if (e.target.value.length === 4) {
      endHour = e.target.value;
    }
    console.log(endHour);
  };

  console.log("eventDate: ", eventDate);
  console.log("startHour: ", startHour);
  console.log("timeSpent: ", timeSpent);
  console.log("endHour: ", endHour);

  function calculateTimeAvailability() {
    /* Only maintain the eventsDay that are equal to the input from the user. */
    const allSameDayEvents = _.filter(eventsDay, function (event) {
      return event.day === eventDate;
    });

    console.log("Same Day Events: ", allSameDayEvents);
    /* Only main the title, start and end hour keys. */
    const eventsSchedule = allSameDayEvents.map(
      ({ title, start, end, min, ...rest }) => ({
        title,
        start,
        end,
        min,
      })
    );

    /* Convert schedule from string to integer. */
    const convertStringtoInt = eventsSchedule.map((event) => {
      return {
        ...event, //copies all items first...
        start: parseInt(event.start),
        end: parseInt(event.end),
      };
    });

    /* Sort array of objects by key 'min'. */
    let sortedEventsSchedule = _.sortBy(convertStringtoInt, "min").reverse();

    /* Remove events that start and end at the same time. */
    sortedEventsSchedule = sortedEventsSchedule.reduce((unique, o) => {
      if (!unique.some((obj) => obj.start === o.start && obj.end === o.end)) {
        unique.push(o);
      }
      return unique;
    }, []);

    console.log("Sorted by Minutes Spent: ", sortedEventsSchedule);
    console.log("------REMOVE OVERLAPPING EVENTS--------");
    /* Call function to remove overlapping events and save. */
    sortedEventsSchedule = removeOverlappingEvents(sortedEventsSchedule);
    /* Sort array of objects by key 'start' after overlapped events were deleted. */
    sortedEventsSchedule = _.sortBy(sortedEventsSchedule, "start");
    console.log("Sorted by Start Time: ", sortedEventsSchedule);
    console.log("------CALCULATE TIME LEFT--------");
    /* Call function to time how much time is left. */
    console.log(calculateTimeLeft(sortedEventsSchedule));
  }

  /* Function to remove smaller overalapping events.
   * Ex: remove task 7:30-8:00 if there is a task 7:00-8:00.
   * Keep the task with larger time spent. */
  function removeOverlappingEvents(sortedEventsSchedule) {
    for (let i = 0; i < sortedEventsSchedule.length; i++) {
      const startHour = sortedEventsSchedule[i].start;
      const endHour = sortedEventsSchedule[i].end;
      //console.log("startHour: " + startHour + " endHour: " + endHour);

      for (let j = i + 1; j < sortedEventsSchedule.length; j++) {
        //console.log("j: ", j);
        const nextStartHour = sortedEventsSchedule[j].start;
        const nextEndHour = sortedEventsSchedule[j].end;
        const nextTitle = sortedEventsSchedule[j].title;

        //console.log("nextStartHour: " + nextStartHour + " nextEndHour: " + nextEndHour);*/

        if (startHour <= nextStartHour && endHour >= nextEndHour) {
          //console.log(nextTitle);
          sortedEventsSchedule = _.filter(
            sortedEventsSchedule,
            function (event) {
              return event.title != nextTitle;
            }
          );
          //console.log(sortedEventsSchedule.length);
          j--;
        }
      }
    }
    /* Returns array with the overlapping shorter events removed. */
    return sortedEventsSchedule;
  }

  /* Functio to check if there is available time to add a new event in the same day. */
  function calculateTimeLeft(sortedEventsSchedule) {
    let minutesWorkedSum = [];
    let didRemain = false;

    /* Iterate over all the objects in the array */
    for (let i = 0; i < sortedEventsSchedule.length - 1; i++) {
      const title = sortedEventsSchedule[i].title;
      const startHour = sortedEventsSchedule[i].start;
      const endHour = sortedEventsSchedule[i].end;

      //const nextTitle = sortedEventsSchedule[i + 1].title;
      const nextStartHour = sortedEventsSchedule[i + 1].start;
      const nextEndHour = sortedEventsSchedule[i + 1].end;

      console.log(title);

      /* if it is the first event of the day, save minutes.*/
      if (i === 0 || didRemain) {
        minutesWorkedSum.push(calculateHours(startHour, endHour, false));
      } else {
        /*const prevTitle = sortedEventsSchedule[i - 1].title;
      const prevStartHour = sortedEventsSchedule[i - 1].start;
      const prevEndHour = sortedEventsSchedule[i - 1].end;*/
      }

      /* if the end hour overlaps with the start hour of the next event.  */
      if (endHour > nextStartHour) {
        // do nothing
        if (endHour >= nextEndHour) {
          // do nothing: move to the next of the next event
        } else {
          /* if the end hour of the next event is later than the end hour of the current. */
          minutesWorkedSum += nextEndHour - endHour;
        }
        didRemain = false;
        /* if the end hour does not overlap with the start hour of the next event.  */
      } else if (endHour < nextStartHour) {
        minutesWorkedSum.push(calculateHours(endHour, nextStartHour, true));
        didRemain = true;
      } else {
        /* if equal, do nothing */
      }

      /* If the last event*/
      if (i + 1 === sortedEventsSchedule.length - 1) {
        minutesWorkedSum.push(
          calculateHours(nextStartHour, nextEndHour, false)
        );
      }
    }
  }

  /* Function to calculate hours between a range of hours. */
  function calculateHours(start, end, isFlipped) {
    let hour = 0;
    let min = 0;

    hour = (end - (end % 100)) / 100 - (start - (start % 100)) / 100;
    min = hour * 60 + (end % 100) - (start % 100);

    hour = Math.floor(min / 60);
    min = min % 60;

    return [hour, min, isFlipped, start, end];
  }

  // On submit, insert the data.
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
    console.log(title);
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
      remarks
    };
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
      <Modal size="lg" show={show} onHide={handleClose}>
        <Formik
          validationSchema={schema}
          onSubmit={submit}
          initialValues={{
            day: " ",
            title: " ",
            start: " ",
            end: " ",
            min: 0,
            type: " ",
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
              <Modal.Header closeButton>
                <Modal.Title as="h5">Add New Event</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                <Container id={PAGE_IDS.ADD_EVENT_DAY} className="py-3">
                  <Alert key={"info"} variant={"info"}>
                    Click on the button <ClockHistory />{" "}
                    <b>Check Availability</b> to inspect how many hours are left
                    for the day.
                  </Alert>
                  <Row className="mb-3">
                    <Form.Group as={Col} md="4" controlId="validationFormik01">
                      <Form.Label>Event Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="day"
                        onChange={(e) => {
                          setEventDate(e);
                          handleChange(e);
                        }}
                        isValid={touched.day && !errors.day}
                      />
                    </Form.Group>

                    <Form.Group as={Col} md="8" controlId="validationFormik02">
                      <Form.Label>Event Title</Form.Label>
                      <Form.Control
                        type="text"
                        name="title"
                        placeholder="Ex: INSTALL WINDOW"
                        onChange={handleChange}
                        isValid={touched.title && !errors.title}
                      />
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
                        <Form.Control
                          type="text"
                          name="start"
                          onChange={(e) => {
                            setStartHour(e);
                            handleChange(e);
                          }}
                          isValid={touched.start && !errors.start}
                        />
                      </Form.Group>

                      <Form.Group
                        as={Col}
                        md="4"
                        controlId="validationCustom04"
                      >
                        <Form.Label>Time Spent (Mins)</Form.Label>
                        <Form.Control
                          type="number"
                          name="min"
                          placeholder="Ex: 60"
                          min={0}
                          onChange={(e) => {
                            setTimeSpent(e);
                            handleChange(e);
                          }}
                          isValid={touched.min && !errors.min}
                        />
                        <Form.Control.Feedback type="invalid">
                          Please provide a valid number.
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group
                        as={Col}
                        md="4"
                        controlId="validationFormik05"
                      >
                        <Form.Label>End Hour</Form.Label>
                        <Form.Control
                          required
                          type="text"
                          name="end"
                          onChange={(e) => {
                            setEndHour(e);
                            handleChange(e);
                          }}
                          isValid={touched.end && !errors.end}
                        />
                      </Form.Group>
                    </Row>

                    <Row className="mb-3">
                      <Alert
                        style={{ backgroundColor: "#eb9d0c" }}
                        show={showAlert}
                      >
                        <>
                          <Alert.Heading>
                            <ExclamationDiamond /> Event Report
                          </Alert.Heading>
                          <p>We found conflicting timeouts within the range!</p>
                          <Card>
                            <Card.Header>
                              Total Amount of Available Time in Minutes:{" "}
                            </Card.Header>
                            <Table striped bordered hover>
                              <thead>
                                <tr>
                                  <th>Title</th>
                                  <th>Start Date</th>
                                  <th>End Date</th>
                                </tr>
                              </thead>
                              <tbody>
                                {/*conflictingDates.map((date) => (
                                    <ConflictingDate date={date} />
                                  ))*/}
                              </tbody>
                            </Table>
                            <Card.Footer>
                              <h6>Suggested End Date:</h6>
                            </Card.Footer>
                          </Card>
                          <hr />
                        </>

                        <div className="d-flex justify-content-end">
                          <Button
                            onClick={() => setShowAlert(false)}
                            variant="primary"
                          >
                            Close
                          </Button>
                        </div>
                      </Alert>
                      {!showAlert && eventDate && startHour && endHour && timeSpent!= 0 ? (
                        <Row>
                          <div>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => {
                                calculateTimeAvailability();
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
                        required
                        type="number"
                        name="ml1"
                        min={0}
                        onChange={handleChange}
                        isValid={touched.end && !errors.end}
                      />
                    </Form.Group>
                    <Form.Group as={Col} controlId="validationFormik07">
                      <Form.Label>ML2</Form.Label>
                      <Form.Control
                        required
                        type="number"
                        name="ml2"
                        min={0}
                        onChange={handleChange}
                        isValid={touched.end && !errors.end}
                      />
                    </Form.Group>
                    <Form.Group as={Col} controlId="validationFormik08">
                      <Form.Label>ML3</Form.Label>
                      <Form.Control
                        required
                        type="number"
                        name="ml3"
                        min={0}
                        onChange={handleChange}
                        isValid={touched.end && !errors.end}
                      />
                    </Form.Group>
                  </Row>

                  {/* Type and Section Row*/}
                  <Row className="mb-3">
                    <Form.Group as={Col} controlId="validationFormik09">
                      <Form.Label>Event Type</Form.Label>
                      <Form.Select
                        required
                        name="type"
                        onChange={handleChange}
                        isValid={touched.end && !errors.end}
                      >
                        <option value="1">Planned</option>
                        <option value="2">Unexpected</option>
                        <option value="3">Plan Incurred</option>
                      </Form.Select>
                    </Form.Group>
                    <Form.Group as={Col} controlId="validationFormik10">
                      <Form.Label>Aircraft Section</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        name="section"
                        onChange={handleChange}
                        isValid={touched.end && !errors.end}
                      />
                    </Form.Group>
                  </Row>

                  <Row>
                    <Form.Group as={Col} controlId="validationFormik11">
                      <Form.Label>Remarks</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        name="remarks"
                        placeholder="Relevant information about the event."
                        onChange={handleChange}
                        isValid={touched.end && !errors.end}
                      />
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

export default AddEventDay;
