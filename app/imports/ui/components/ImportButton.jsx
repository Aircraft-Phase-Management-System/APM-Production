import React, { useState } from "react";
import { Col, Button, InputGroup, Form } from "react-bootstrap";
import swal from "sweetalert";
import { Airplane, FileEarmarkArrowDown } from "react-bootstrap-icons";
import { defineMethod } from "../../api/base/BaseCollection.methods";
import Modal from "react-bootstrap/Modal";

import Papa from "papaparse";
import { EventsDay } from "../../api/event_day/EventDayCollection";

const ImportButton = () => {
  const [show, setShow] = useState(false);
  const [lane, setLane] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [selectedFile, setSelectedFile] = useState(null);

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

  console.log(lane);

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
    console.log("button pressed");
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
              event.Time_Start.substring(0, 2) + ":" + event.Time_Start.substring(2);
            event.Time_End =
              event.Time_End.substring(0, 2) + ":" + event.Time_End.substring(2);
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

        console.log(definitionData);

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
