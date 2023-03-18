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
  /*{ title: "New Year's Day", start: "2023-12-30", end: "2024-01-02" },*/
   /*{ title: "New Year's Day", start: "2023-12-30", end: "2024-01-02" },*/
  { title: "Independece Day", start: "2023-07-04", end: null },
  { title: "Veterans Dar", start: "2023-11-11", end: null },
  { title: "Christmas Day", start: "2023-12-10", end: "2023-12-13" },
  { title: "Christmas Day1", start: "2023-12-20", end: "2023-12-22" },
  /*{ title: "Christmas Day", start: "2023-12-25", end: "2023-12-27" },*/
];

const allStartHolidays = _.pluck(holidays, "start");
const allEndHolidays = _.pluck(holidays, "end");

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
    let strRecvStartMonth = startDate.substring(5, 7);
    const strRecvStartDay = startDate.substring(8);

    let recvStartYear = parseInt(strRecvStartYear);
    let recvStartMonth = parseInt(strRecvStartMonth);
    let recvStartDay = parseInt(strRecvStartDay);

    /* Calculate possible end date */
    let calcYear = null;
    let calcMonth = null;
    let calcDay = recvStartDay + reqNumberDays - 1;

    let hasChangedMonth = false;

    let [monthName, monthDays] = findMonthNamesAndDays(strRecvStartMonth);
    let possEndDate = null;

    /* If the day calculated is larger than the days within the current month */
    if (monthDays <= calcDay) {
      /* TODO: Move to next month. */
      console.log("Calc Day: ", calcDay);
      console.log("Month Days: ", monthDays);
      [calcYear, calcMonth, calcDay] = moveNextMonth(recvStartYear, recvStartMonth, recvStartDay, reqNumberDays, monthName, monthDays);
      possEndDate = calcYear  + "-" +  calcMonth  + "-" + (calcDay < 10 ? "0" + calcDay : calcDay);
      hasChangedMonth = true;
    } else {
      calcYear = recvStartYear;
      calcMonth = recvStartMonth;
      possEndDate = calcYear  + "-" +  calcMonth  + "-" + (calcDay < 10 ? "0" + calcDay : calcDay);
    }

    console.log("Start Date", startDate);
    console.log("Possible End Date", possEndDate);

    /* Transform into date formart the start date from the and calculated possEnd end date. */
    startDate = Date.parse(startDate);
    possEndDate = Date.parse(possEndDate);

    const numOffDays = allDatesRange.length;
    let curOffDays = 0;

    /* Loop through all the ranges of the off days*/
    for (let offDay = 0; offDay < numOffDays; offDay++) {
      let curStart = allDatesRange[offDay][0];
      let curEnd = allDatesRange[offDay][1];

      let finalEndDate = null;

      let curMonthDays = 0;

      const curStartYear = parseInt(curStart.substring(0, 4));
      const curStartMonth = parseInt(curStart.substring(5, 7));
      const curStartDay = parseInt(curStart.substring(8));

      /* DONE: If the there is only one off day (it is not a range) */
      if (!curEnd) {
        curStart = Date.parse(curStart);

        if (curStart >= startDate && curStart <= possEndDate) {
          console.log("1 Non Working Day Found Within Range");
          conflictingRangesIndex.push(offDay);
          totalConflictOffDays++;
          calcDay++; 
          finalEndDate = calcYear  + "-" +  (calcMonth < 10 && (typeof calcMonth != 'string') ? "0" + calcMonth: calcMonth)  + "-" + (calcDay < 10 ? "0" + calcDay: calcDay) + " " + "15:50:00";
          setEndDate(finalEndDate);
          setSuggestion(true);

          console.log("Final End Date: ", finalEndDate);
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
        //console.log(curEnd >= startDate);
        // console.log(curEnd <= possEndDate);
        if (
          (curStart >= startDate &&
          curStart <= possEndDate) &&
          (curEnd >= startDate &&
          curEnd <= possEndDate)
        ) {
          console.log("Range: Start Day & End Date");
          conflictingRangesIndex.push(offDay);

          /* if the current start month is not the same as the end month */
          if (curStartMonth != curEndMonth) {
            curMonthDays = findMonthNamesAndDays(curStartMonth < 10 ? "0" + curStartMonth.toString() : curStartMonth.toString())[1];
            console.log("curMonthDays: ", curMonthDays);
            totalConflictOffDays += curMonthDays - curStartDay + 1 + curEndDay;
          } else {
            totalConflictOffDays += curOffDays;
          }
            /* GET POSSIBLE END DATE AND ADD DAYS TO IT, CHECK IF OVERFLOW MONTH */
            /* If overflow, get the month and check number of days*/
            /* Update Possible End Date */
          console.log("totalConflictOffDays: ", totalConflictOffDays);
          
          let year = recvStartYear;
          let month = recvStartMonth;
          let day = recvStartDay + reqNumberDays - 1 + curOffDays

          let [monthName, monthDays] = findMonthNamesAndDays(curStartMonth < 10 ? "0" + curStartMonth.toString() : curStartMonth.toString());

          //curMonthDays = findMonthNamesAndDays(curStartMonth < 10 ? "0" + curStartMonth.toString() : curStartMonth.toString())[1];

          if(monthDays <= day && !hasChangedMonth) {
            console.log("Current Month Days: ", monthDays);
            console.log("recvStartYear", recvStartYear);
            console.log("recvStartMonth", recvStartMonth);
            console.log("recvStartDay", recvStartDay);
            console.log("reqNumberDays", reqNumberDays);
            console.log("monthName", monthName);
            console.log("monthDays", monthDays);
            [calcYear, calcMonth, calcDay] = moveNextMonth(recvStartYear, recvStartMonth, recvStartDay, reqNumberDays, monthName, monthDays);
            console.log("calcYear: ", calcYear);
            console.log("calcMonth: ", calcMonth );
            console.log("calcDay: ", calcDay);
            calcDay += totalConflictOffDays;

            possEndDate = calcYear  + "-" +  calcMonth  + "-" + (calcDay < 10 ? "0" + calcDay : calcDay);
            setEndDate(possEndDate + " " + "15:50:00");

          } else {
            /*setEndDate(
              recvStartYear +
                "-" +
                recvStartMonth +
                "-" +
                (recvStartDay + reqNumberDays - 1 + curOffDays) + " " + " 15:50:00"
            );*/

          }

          //setSuggestion(true); 

          /* If current start off day is within  */
        } else if (curStart >= startDate && curStart <= possEndDate) {
          /* TODO */
          console.log("Range: Start Day Only");
          conflictingRangesIndex.push(offDay);
          setSuggestion(true);

          /* If possible calculated date is within off day range */
        } else if (curEnd >= startDate && curEnd <= possEndDate) {
          /* TODO */
          let dayDiffLeft = possEndDate - curStartDay;
          conflictingRangesIndex.push(offDay);
          setSuggestion(true);
          console.log("Range: End Date Only");
        }
      }
    }

      if(hasChangedMonth) {
        calcDay += totalConflictOffDays;

        if(calcDay >= monthDays) {
          [calcYear, calcMonth, calcDay] = moveNextMonth(recvStartYear, recvStartMonth, recvStartDay, reqNumberDays + totalConflictOffDays, monthName, monthDays);

        }
        setEndDate(calcYear  + "-" +  calcMonth  + "-" + (calcDay < 10 ? "0" + calcDay : calcDay));

      } else {
              /* No non-Working days and hours found, set data to initial calculated date. */
      setEndDate(
        recvStartYear +
          "-" +
          recvStartMonth +
          "-" +
          (recvStartDay + reqNumberDays - 1 + totalConflictOffDays) + " " + " 15:50:00"
      );

      }

      setSuggestion(true);
      //setEndDate(possEndDate + " " + "15:50:00");

  };

  function findMonthNamesAndDays(monthStr) {
    let monthNamesAndDays = new Map([
      ["01", ["Jan", 31]],
      ["02", ["Feb", 28]],
      ["03", ["Mar", 31]],
      ["04", ["Apr", 30]],
      ["05", ["May", 31]],
      ["06", ["Jun", 30]],
      ["07",["Jul", 31]],
      ["08", ["Aug", 31]],
      ["09", ["Sep", 30]],
      ["10", ["Oct", 31]],
      ["11", ["Nov", 30]],
      ["12", ["Dec", 31]],
    ]);
    
    return monthNamesAndDays.get(monthStr);

  }

  function moveNextMonth(year, month, day, reqNumberDays, monthName, monthDays) {
    let calcDay = day + reqNumberDays - 1;
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

    let getDaysNumAndName= new Map([
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
      ["Dec",[31, "12"]],
    ]);

    daysLeft = calcDay - monthDays;
    nextMonthName = getNextMonth.get(monthName)[0]; // remove [0] later
    [nextMonthDays, nextMonthNum] = getDaysNumAndName.get(nextMonthName);

    console.log("Next Month Name:", nextMonthName);
    console.log("Next Month Days:", nextMonthDays);
    console.log("Next Month Num:", nextMonthNum);
    console.log("Days Left:", daysLeft);

    while(!wasMonthFound) {

      /* If month is Jan, move a year ahead. */
      if(nextMonthName === "Jan") {
        year++;
        console.log("New Year. Found Jan Month!")

      }

      console.log("IF: Days Left:", daysLeft);
      console.log("IF: nextMonthDays:", nextMonthDays);
      if(daysLeft <= nextMonthDays) {
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

export default AddEvent;
