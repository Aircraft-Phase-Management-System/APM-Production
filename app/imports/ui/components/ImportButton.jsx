import React, { useState } from "react";
import { Col, Button, InputGroup, Form } from "react-bootstrap";
import swal from "sweetalert";
import { PlusSquare, Airplane } from "react-bootstrap-icons";
import { defineMethod } from "../../api/base/BaseCollection.methods";
import Modal from "react-bootstrap/Modal";

import Papa from "papaparse";
import { EventsDay } from "../../api/event_day/EventDayCollection";

const ImportButton = () => {
  const [show, setShow] = useState(false);
  const [lane, setLane] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [selectedFile, setSelectedFile] = useState(null);

  const handleLane = (e) => {
    const laneValue = e.target.value;
    const number = parseInt(laneValue[1]);
    if (laneValue.length === 2 && laneValue[0] === "#" && Number.isInteger(number)) {
      setLane(e.target.value);
    }
  };

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

      const data = parsedData.map(v => ({...v, laneID: lane}));
      console.log(data);

      // Save the parsed data to the collection
      data.forEach((item) => {
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
        <PlusSquare />
        <Col>Import</Col>
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Upload a File</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Phase Lane ID:</p>
          <InputGroup className="mb-3">
            <InputGroup.Text><Airplane size={22}/></InputGroup.Text>
            <Form.Control
              placeholder="Ex: #1"
              onChange={handleLane}

            />
          </InputGroup>

          <p>Select a file to upload:</p>
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
