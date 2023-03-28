import React, { useState } from "react";
import { Col, Container, Row, Button, Form, Card, Table } from "react-bootstrap";
import { XSquare, ExclamationDiamond, PlusSquare } from "react-bootstrap-icons";
import swal from "sweetalert";
import { useTracker } from "meteor/react-meteor-data";
import { Timeouts } from "../../api/timeout/TimeoutCollection";
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
let conflictingDates = [];

const schema = yup.object().shape({
  title: yup.string().required(),
  start: yup.string().required(),
  days: yup.number().required(),
  end: yup.string().required(),
  color: yup.string().required(),
});

/* Renders the AddEvent page for adding a document. */
const AddEvent = ({laneID}) => {

  const { ready, timeouts } = useTracker(() => {

    const subscription = Timeouts.subscribeTimeout();
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the Stuff documents
    const timeoutItems = Timeouts.find(
      {},
      { sort: { title: 1 } }
    ).fetch();

    return {
      timeouts: timeoutItems,
      ready: rdy,
    };
  }, []);

  console.log(timeouts);

  const allStartTimeouts = _.pluck(timeouts, "start");
  const allEndTimeouts = _.pluck(timeouts, "end");

  const allDatesRange = _.zip(allStartTimeouts, allEndTimeouts);

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

  /* Save value for start date */
  const setStartDateVal = (e) => {
      const date = e.target.value;
      startDate = date;
   
  };

    /* Save value for required number of days. */
    const setRequiredDaysVal = (e) => {
        const numberOfDays = e.target.valueAsNumber;
        reqNumberDays = numberOfDays;
      
    };

  const calculateEndDate = () => {
    /* Received inputs from the user using the form */
    const strStartYear = startDate.substring(0, 4);
    const strStartMonth = startDate.substring(5, 7);
    const strStartDay = startDate.substring(8);

    /* Transform the received inputs to an integer value and save. */
    let startYear = parseInt(strStartYear);
    let startMonth = parseInt(strStartMonth);
    let startDay = parseInt(strStartDay);

    /* Calculate possible end date */
    let endYear = null;
    let endMonth = null;
    let endDay = startDay + reqNumberDays - 1;

    let hasChangedMonth = false;
    let possEndDate = null;
    let conflictingRangesIndexTemp = [];
    let prevConflictingDays = 0;

    /* Get the name and number of days of the month */
    let [monthName, monthDays] = findMonthNamesAndDays(strStartMonth);

    /* If the day calculated is larger than the days within the current month */
    if (monthDays < endDay) {
      /* Move to next month. */
      [endYear, endMonth, endDay] = moveNextMonth(startYear, startMonth, startDay, reqNumberDays, monthName, monthDays);
      possEndDate = endYear + "-" + endMonth + "-" + (endDay < 10 ? "0" + endDay : endDay);
      hasChangedMonth = true;

      console.log("Calc Day: ", endDay);
      console.log("Month Days: ", monthDays);

    } else {
      endYear = startYear;
      endMonth = startMonth;
      possEndDate = endYear + "-" + (endMonth < 10 ? "0" + endMonth : endMonth) + "-" + (endDay < 10 ? "0" + endDay : endDay);
    }

    console.log("Start Date", startDate);
    console.log("Possible End Date", possEndDate);

    /* Transform into date formart the start date from the and calculated possEnd end date. */
    startDate = Date.parse(startDate);
    possEndDate = Date.parse(possEndDate);

    /* Loop through all the ranges of the off days*/
    for (let offDay = 0; offDay < allDatesRange.length; offDay++) {
      let curStart = allDatesRange[offDay][0];
      let curEnd = allDatesRange[offDay][1];

      let curMonthDays = 0;
      let curOffDays = 0;

      const curStartYear = parseInt(curStart.substring(0, 4));
      const curStartMonth = parseInt(curStart.substring(5, 7));
      const curStartDay = parseInt(curStart.substring(8));

      console.log("Current End: ", curEnd);
      /* If the there is only one off day (it is not a range) */
      if (curEnd === '-') {
        console.log("hereeee");
        curStart = Date.parse(curStart);

        if (curStart >= startDate && curStart <= possEndDate) {
          console.log("1 Non Working Day Found Within Range");
          conflictingRangesIndex.push(offDay);
          totalConflictOffDays++;
          //endDay++;
        }

        /* If it is a range of off days */
      } else {
        /* Only get day, month, and year of current off day if end exists (a range exist) */
        const curEndYear = parseInt(curEnd.substring(0, 4));
        const curEndMonth = parseInt(curEnd.substring(5, 7));
        const curEndDay = parseInt(curEnd.substring(8));
        curOffDays = Math.abs(curEndDay - curStartDay) + 1;

        console.log("CurStart: ", curStart);
        console.log("CurEnd: ", curEnd);

        curStart = Date.parse(curStart);
        curEnd = Date.parse(curEnd);

        /* If current days off takes place within event range */
        if (curStart >= startDate && curStart <= possEndDate && curEnd >= startDate && curEnd <= possEndDate) {
          console.log("Range: Start Day & End Date");
          conflictingRangesIndex.push(offDay);

          /* if the current start month is not the same as the end month */
          if (curStartMonth != curEndMonth) {
            curMonthDays = findMonthNamesAndDays(
              curStartMonth < 10
                ? "0" + curStartMonth.toString()
                : curStartMonth.toString()
            )[1];
            console.log("curMonthDays: ", curMonthDays);
            totalConflictOffDays += curMonthDays - curStartDay + 1 + curEndDay;
          } else {
            totalConflictOffDays += curOffDays;
          }

          endYear = hasChangedMonth ? endYear : startYear;
          endMonth = hasChangedMonth ? endMonth : startMonth;

          let [monthName, monthDays] = findMonthNamesAndDays(
            curStartMonth < 10
              ? "0" + curStartMonth.toString()
              : curStartMonth.toString()
          );

          //curMonthDays = findMonthNamesAndDays(curStartMonth < 10 ? "0" + curStartMonth.toString() : curStartMonth.toString())[1];
            
          if (monthDays < (startDay + reqNumberDays - 1 + totalConflictOffDays) && !hasChangedMonth) {
            console.log("Current Month Days: ", monthDays);
            console.log("startYear", startYear);
            console.log("startMonth", startMonth);
            console.log("startDay", startDay);
            console.log("reqNumberDays", reqNumberDays);
            console.log("monthName", monthName);
            console.log("monthDays", monthDays);
            [endYear, endMonth, endDay] = moveNextMonth(
              startYear,
              startMonth,
              startDay,
              reqNumberDays + totalConflictOffDays,
              monthName,
              monthDays
            );
            console.log("endYear: ", endYear);
            console.log("endMonth: ", endMonth);
            console.log("endDay: ", endDay);
            endDay -= curOffDays;

          } 

          /* If current start off day is within  */
        } else if (curStart >= startDate && curStart <= possEndDate) {
          totalConflictOffDays += curStartDay - curStartDay + 1;
          totalConflictOffDays += curEndDay - endDay;
          console.log("Range: Start Day Only");
          console.log("curStartDay: ", curStartDay);
          console.log("Calc Day Possible End: ", endDay);
          console.log("totalConflictOffDays: ", totalConflictOffDays);

          conflictingRangesIndex.push(offDay);

          /* If possible calculated end date is within off day range */
        } else if (curEnd >= startDate && curEnd <= possEndDate) {
          totalConflictOffDays += curEndDay - startDay + 1;

          console.log("Range: Start Day Only");
          console.log("totalConflictOffDays: ", totalConflictOffDays);

          conflictingRangesIndex.push(offDay);
        }
      }

      if(totalConflictOffDays != 0 && conflictingRangesIndexTemp.length == 0) {
        conflictingRangesIndexTemp = conflictingRangesIndex.slice();
        console.log("here conflictingRangesIndexTemp:", conflictingRangesIndexTemp);
        endDay += totalConflictOffDays;
        prevConflictingDays = totalConflictOffDays;

        console.log("End Day Here: ", endDay);
        console.log(endYear + "-" + (endMonth < 10 ? "0" + endMonth : endMonth) + "-" + (endDay < 10 ? "0" + endDay : endDay));
        possEndDate = Date.parse(endYear + "-" + (endMonth < 10 ? "0" + endMonth : endMonth) + "-" + (endDay < 10 ? "0" + endDay : endDay));
      } else if(conflictingRangesIndexTemp.length < conflictingRangesIndex.length) {
        console.log("BIGGER THAN");
        conflictingRangesIndexTemp = conflictingRangesIndex.slice();
        endDay += totalConflictOffDays - prevConflictingDays;

        console.log("End Day Here 1: ", endDay);
        console.log(endYear + "-" + (endMonth < 10 ? "0" + endMonth : endMonth) + "-" + (endDay < 10 ? "0" + endDay : endDay));
        possEndDate = Date.parse(endYear + "-" + (endMonth < 10 ? "0" + endMonth : endMonth) + "-" + (endDay < 10 ? "0" + endDay : endDay));
      }

    }

   // endDay += totalConflictOffDays;

    if (hasChangedMonth && totalConflictOffDays!= 0) {
      if (endDay >= monthDays) {
        [endYear, endMonth, endDay] = moveNextMonth(
          startYear,
          startMonth,
          startDay,
          reqNumberDays + totalConflictOffDays,
          monthName,
          monthDays
        );
        console.log("HERRRREEE");
      }
      

    } 

    /* Start, Start & Multiple, Both Ranges, Both Ranges & Over Month-Year, Both Ranges & Over Month-Year & Multiple, No Conflict, No Conflict & Over Month-Year, 
      */
    console.log("totalConflictOffDays: ", totalConflictOffDays);
    console.log("End Day", endDay);
    possEndDate = endYear + "-" +  (endMonth < 10 && typeof endMonth != "string"? "0" + endMonth: endMonth) + "-" + (endDay < 10 ? "0" + endDay : endDay);
    setEndDate(possEndDate + " " + "15:50:00");
    console.log(endDate);
    setSuggestion(true);
  };

  function findMonthNamesAndDays(monthStr) {
    let monthNamesAndDays = new Map([
      ["01", ["Jan", 31]],
      ["02", ["Feb", 28]],
      ["03", ["Mar", 31]],
      ["04", ["Apr", 30]],
      ["05", ["May", 31]],
      ["06", ["Jun", 30]],
      ["07", ["Jul", 31]],
      ["08", ["Aug", 31]],
      ["09", ["Sep", 30]],
      ["10", ["Oct", 31]],
      ["11", ["Nov", 30]],
      ["12", ["Dec", 31]],
    ]);

    return monthNamesAndDays.get(monthStr);
  }

  function moveNextMonth(
    year,
    month,
    day,
    reqNumberDays,
    monthName,
    monthDays
  ) {
    let endDay = day + reqNumberDays - 1;
    let daysLeft = 0;
    let wasMonthFound = false;

    let nextMonthName = null;
    let nextMonthDays = 0;
    let nextMonthNum = null;

    let getNextMonth = new Map([
      ["Jan", ["Feb"]],
      ["Feb", ["Mar"]],
      ["Mar", ["Apr"]],
      ["Apr", ["May"]],
      ["May", ["Jun"]],
      ["Jun", ["Jul"]],
      ["Jul", ["Aug"]],
      ["Aug", ["Sep"]],
      ["Sep", ["Oct"]],
      ["Oct", ["Nov"]],
      ["Nov", ["Dec"]],
      ["Dec", ["Jan"]],
    ]);

    let getDaysNumAndName = new Map([
      ["Jan", [31, "01"]],
      ["Feb", [28, "02"]],
      ["Mar", [31, "03"]],
      ["Apr", [30, "04"]],
      ["May", [31, "05"]],
      ["Jun", [30, "06"]],
      ["Jul", [31, "07"]],
      ["Aug", [31, "08"]],
      ["Sep", [30, "09"]],
      ["Oct", [31, "10"]],
      ["Nov", [30, "11"]],
      ["Dec", [31, "12"]],
    ]);

    daysLeft = endDay - monthDays;
    nextMonthName = getNextMonth.get(monthName)[0]; // remove [0] later
    [nextMonthDays, nextMonthNum] = getDaysNumAndName.get(nextMonthName);

    console.log("Next Month Name:", nextMonthName);
    console.log("Next Month Days:", nextMonthDays);
    console.log("Next Month Num:", nextMonthNum);
    console.log("Days Left:", daysLeft);

    while (!wasMonthFound) {
      /* If month is Jan, move a year ahead. */
      if (nextMonthName === "Jan") {
        year++;
        console.log("New Year. Found Jan Month!");
      }

      console.log("IF: Days Left:", daysLeft);
      console.log("IF: nextMonthDays:", nextMonthDays);
      if (daysLeft <= nextMonthDays) {
        console.log("Case 1: Move Only One Month");
        day = daysLeft;
        month = nextMonthNum;
        wasMonthFound = true;
      } else {
        console.log("Case 2: Move Many Months");
        daysLeft -= nextMonthDays;
        console.log("Days Left: ", daysLeft);

        nextMonthName = getNextMonth.get(nextMonthName)[0]; // remove [0] later
        [nextMonthDays, nextMonthNum] = getDaysNumAndName.get(nextMonthName);
        console.log("Next Month Name:", nextMonthName);
        console.log("Next Month Days:", nextMonthDays);
        console.log("Next Month Num:", nextMonthNum);
      }
    }

    console.log("year: ", year);
    console.log("month:", month);
    console.log("day: ", day);

    return [year, month, day];
  }

  for (let i = 0; i < conflictingRangesIndex.length; i++) {
    conflictingDates.push(allDatesRange[conflictingRangesIndex[i]]);
  }

  // On submit, insert the data.
  const submit = (data) => {
    const { title, start, days, end, color } = data;
    console.log("end date: ", end);
    const owner = Meteor.user().username;
    const collectionName = Events.getCollectionName();
    const definitionData = { title, start, days, end, color, laneID, owner };
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
      <Button variant="outline-primary" size="sm" onClick={handleShow}><PlusSquare></PlusSquare>
        {' '} Add New Event
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
                        type="date"
                        name="start"
                        placeholder="Ex: 2023-03-15"
                        onChange={(e) => {
                          setStartDateVal(e);
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
                          setRequiredDaysVal(e);
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
                    <Alert
                      style={{ backgroundColor: "#eb9d0c" }}
                      show={showAlert}
                    >
                      {showSuggestion && totalConflictOffDays!= 0 ? (
                        <>
                          <Alert.Heading>
                            <ExclamationDiamond /> Alert
                          </Alert.Heading>
                          <p>We found conflicting timeouts within the range!</p>
                          <Card>
                            <Card.Header>
                              Total of Number of Conflicting Timeout(s):{" "}
                              {totalConflictOffDays}
                            </Card.Header>
                              <Table striped bordered hover>
                                <thead>
                                  <tr>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {conflictingDates.map((date) => (
                                    <ConflictingDate date={date} />
                                  ))}
                                </tbody>
                              </Table>
                            <Card.Footer><h6>Suggested End Date: {endDate}</h6></Card.Footer>
                          </Card>
                          <hr />
                        </>
                      ) : (
                          <h6>Suggested End Date: {endDate}</h6>
                      )}
                      <div className="d-flex justify-content-end">
                        <Button
                          onClick={() => setShowAlert(false)}
                          variant="primary"
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
                      <Form.Label>Choose Event Color</Form.Label>
                      <Form.Control
                        type="color"
                        name="color"
                        defaultValue="#563d7c"
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

const ConflictingDate = ({ date }) => (
  <tr>
    <td>{date[0]}</td>
    <td>{date[1] != null ? date[1]: "-"}</td>
  </tr>
);

export default AddEvent;
