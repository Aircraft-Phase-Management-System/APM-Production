import React, { useState } from "react";
import swal from "sweetalert";
import Papa from "papaparse";
import { useTracker } from "meteor/react-meteor-data";
import { defineMethod } from "../../api/base/BaseCollection.methods";
import { Col, Button, InputGroup, Form, Modal } from "react-bootstrap";
import { Airplane, FileEarmarkArrowDown } from "react-bootstrap-icons";
import { EventsDay } from "../../api/event_day/EventDayCollection";
import { Timeouts } from "../../api/timeout/TimeoutCollection";

const ImportButton = () => {
  const [show, setShow] = useState(false);
  const [lane, setLane] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [selectedFile, setSelectedFile] = useState(null);

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

  const handleLane = (e) => {
    const laneValue = e.target.value;
    const number = parseInt(laneValue[1]);
    if (
      laneValue.length === 3 &&
      laneValue[0] === "#" &&
      Number.isInteger(number)
    ) {
      setLane(e.target.value);
    }
  };

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = () => {
    if (!selectedFile || !lane) {
      return;
    }
    const reader = new FileReader();
    reader.readAsText(selectedFile);

    reader.onload = () => {
      const csvData = reader.result;
      const parsedData = Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
        delimiter: ",",
        trimHeaders: true,
        transformHeader: (header) => header.replace(/ /g, "_"),
      }).data;

      const events = parsedData.map((v) => ({ ...v, laneID: lane }));

      /* Modify the event data to fit the calendar format */
      events.forEach((event) => {
        let date = event.Date;
        let len = date.length;
        let indexDash = [];
        let day = null;
        let month = null;
        let year = null;

        /* Modify the date to be in the format of YYYY-MM-DD */
        if (date.includes("/")) {
          date = date.split("/").join("-");
          for (let i = 0; i < len - 4; i++) {
            if (date.charAt(i) === "-") {
              indexDash.push(i);
            }
          }
          year = date.substring(len - 4);
          month = date.substring(0, indexDash[0]);
          day = date.substring(indexDash[0] + 1, indexDash[1]);

          month = month.length === 1 ? "0" + month : month;
          day = day.length === 1 ? "0" + day : day;

          date = year + "-" + month + "-" + day;
        }

        /* Modify hour to be 07:00 instead of 0700 */
        if (event.Time_Start && event.Time_End) {
          if (!event.Time_Start.includes(":")) {
            event.Time_Start =
              event.Time_Start.substring(0, 2) +
              ":" +
              event.Time_Start.substring(2);
            event.Time_End =
              event.Time_End.substring(0, 2) +
              ":" +
              event.Time_End.substring(2);
          }
        }

        event.Date = date;
      });

      /* Const to find the number of conflicting days for a holiday range. */
      const getOverlappingRangeDays = (eventStrDate, holsRngDates) => {
        let conflictingDays = 0;
        const eventDate = Date.parse(eventStrDate.Date);

        /* Iterate over holidays with a range of days (start and end). */
        for (let i = 0; i < holsRngDates.length; i++) {
          /* Get the start and end dates of the current holiday. */
          const holStartStr = holsRngDates[i][0];
          const holEndStr = holsRngDates[i][1];

          /* Convert to Date format. */
          const holStart = Date.parse(holStartStr);
          const holEnd = Date.parse(holEndStr);

          /* Get the day of the event and the end holiday - to calculate conflicting days.*/
          const eventIntDay = parseInt(eventStrDate.Date.substring(8));
          const holEndDay = parseInt(holEndStr.substring(8));

          if (holStart <= eventDate && eventDate <= holEnd) {
            conflictingDays += holEndDay - eventIntDay + 1;
          }
        }

        return conflictingDays;
      };

      /* Const to find the number of conflicting days for a single holiday. */
      const getOverlappingSingleDays = (event, holsDate) => {
        let conflictingDays = 0;

        /* Iterate over holidays with single of days (start only). */
        for (let i = 0; i < holsDate.length; i++) {
          /* Get the start and end dates of the current holiday. */
          const holDateCurrent = holsDate[i];

          if (event.Date === holDateCurrent) {
            conflictingDays += 1;
          }
        }

        return conflictingDays;
      };

      /* Check whether the day falls on a weekend. */
      const checkWeekendDays = (event) => {
        let year = parseInt(event.Date.substring(0, 4));
        let month = parseInt(event.Date.substring(5, 7)) - 1; // 0-11 months
        let day = parseInt(event.Date.substring(8));

        // Add the date to the object
        let date = new Date();
        date.setFullYear(year);
        date.setMonth(month);
        date.setDate(day);

        let weekendDaysCounter = 0;

        // while the date is still a weekend, increment by one.
        while (date.getDay() == 6 || date.getDay() == 0) {
          weekendDaysCounter += 1;
          date.setDate(day + weekendDaysCounter);
        }

        return weekendDaysCounter;
      };

      /* Receive the month in number and return the name and the amount of days. */
      const findMonthNamesAndDays = (monthStr) => {
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
      };

      /* Receive the name of the month, and find the month after that one. */
      const getNextMonth = (monthStr) => {
        let nextMonth = new Map([
          ["Jan", ["Feb", "02"]],
          ["Feb", ["Mar", "03"]],
          ["Mar", ["Apr", "04"]],
          ["Apr", ["May", "05"]],
          ["May", ["Jun", "06"]],
          ["Jun", ["Jul", "07"]],
          ["Jul", ["Aug", "08"]],
          ["Aug", ["Sep", "09"]],
          ["Sep", ["Oct", "10"]],
          ["Oct", ["Nov", "11"]],
          ["Nov", ["Dec", "12"]],
          ["Dec", ["Jan", "01"]],
        ]);

        return nextMonth.get(monthStr);
      };

      const extractHoldays = (timeouts) => {
        /* Filter all the holidays to check if the parsed dates are the same. */
        const onlyHolidays = _.filter(timeouts, (timeout) => {
          return timeout.type === "Holiday";
        });

        /* Filter all the holidays that have a start and end day - more than one day. */
        const allHolsWithRng = _.filter(onlyHolidays, (holiday) => {
          return holiday.start.length >= 10 && holiday.end.length >= 10;
        });

        /* Zip all the start and end days together for each holiday. */
        const holsRngDates = _.zip(
          _.pluck(allHolsWithRng, "start"),
          _.pluck(allHolsWithRng, "end")
        );

        /* Filter all the single holidays that doesn't have a end date. */
        const allSingleHols = _.filter(onlyHolidays, (holiday) => {
          return holiday.start.length === 10 && holiday.end === "-";
        });

        /* Get all the start dates for single holidays.. */
        const holsSingleDates = _.pluck(allSingleHols, "start");

        return [holsSingleDates, holsRngDates];
      };

      const [holsSingleDates, holsRngDates] = extractHoldays(timeouts);


      events.forEach((event) => {
        let date = event.Date;
        let conflictingDays = 0;

        /* split the date in day, month, year. */
        let day = parseInt(date.substring(8));
        let month = date.substring(5, 7);
        let year = date.substring(0, 4);

        /* Add all the conflicting days together. */
        conflictingDays += getOverlappingRangeDays(event, holsRngDates);
        conflictingDays += getOverlappingSingleDays(event, holsSingleDates);
        conflictingDays += checkWeekendDays(event);

        /* If there are conflicting days, add to the original date. */
        if (conflictingDays != 0) {
          day += conflictingDays;
          date = year + "-" + month + "-" + (day < 10 ? "0" + day : day);

          /* Get name and number of days from the month */
          let [monthName, monthDays] = findMonthNamesAndDays(month);

          /* If the day is bigger than the number of days within that month. */
          if (monthDays < day) {
            let [nextMonthName, nextMonthNmb] = getNextMonth(monthName);
            day = day - monthDays;

            /* If the month is Jan, increment a year. */
            if (nextMonthName === "Jan") {
              nextYear = parseInt(year) + 1;
              date =
                nextYear +
                "-" +
                nextMonthNmb +
                "-" +
                (day < 10 ? "0" + day : day);
            } else {
              date =
                year + "-" + nextMonthNmb + "-" + (day < 10 ? "0" + day : day);
            }
          }
        }

        event.Date = date;
      });

      // Save the parsed data to the collection
      events.forEach((item) => {
        const collectionName = EventsDay.getCollectionName();
        const definitionData = {
          day: item.Date,
          title: item.Task_Completed,
          start: item.Time_Start || " ",
          end: item.Time_End || " ",
          min: item.Time_Spent,
          type: item.Task_Type,
          ml1: item.ML1,
          ml2: item.ML2,
          ml3: item.ML3,
          section: item.Section_Number,
          remarks: item.Remarks,
          laneID: item.laneID,
        };

        defineMethod
          .callPromise({ collectionName, definitionData })
          .catch((error) => swal("Error", error.message, "error"))
          .then(() => {
            swal("Success", "Events added successfully", "success");
          });
      });

      setShow(false);
    };
  };

  let fRef = null;
  return (
    <>
      <Button variant="secondary" onClick={handleShow}>
        <FileEarmarkArrowDown />
        <Col>
          <p>IMPORT CSV</p>
        </Col>
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Upload a File</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Phase Lane ID:</p>
          <InputGroup className="mb-3">
            <InputGroup.Text>
              <Airplane size={22} />
            </InputGroup.Text>
            <Form.Control placeholder="Ex: #01" onChange={handleLane} />
          </InputGroup>

          <p>Select a .csv file to upload:</p>
          <input type="file" onChange={handleFileSelect} />
        </Modal.Body>

        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleFileUpload}
            disabled={!selectedFile || !lane}
          >
            Upload
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ImportButton;
