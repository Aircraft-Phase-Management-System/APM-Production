import React, { useState } from "react";
import { Col, Container, Row, Button } from "react-bootstrap";
import swal from "sweetalert";
import { Meteor } from "meteor/meteor";
import SimpleSchema2Bridge from "uniforms-bridge-simple-schema-2";
import SimpleSchema from "simpl-schema";
import { PlusSquare, XSquare } from "react-bootstrap-icons";
import { defineMethod } from "../../api/base/BaseCollection.methods";
import { PAGE_IDS } from "../utilities/PageIDs";
import Modal from "react-bootstrap/Modal";

import Papa from 'papaparse';
import { EventsDay } from "../../api/event_day/EventDayCollection";


const ImportButton = () => {
  const [show, setShow] = useState(false);
  const [file, setFile] = useState(null);


  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
    console.log("button pressed")
  }

  const handleFileUpload = () => {

    if (!selectedFile) {
      console.log("File not selected.");
      return;
    }
    const reader = new FileReader();
    reader.readAsText(selectedFile);

    reader.onload = () => {
      const csvData = reader.result;
      const parsedData = Papa.parse(csvData, {
        header: true,
        delimiter: ',',
        trimHeaders: true,
        transformHeader: (header) => header.replace(/ /g, '_'),
      }).data;
      // Save the parsed data to the collection
      parsedData.forEach((item) => {
        const collectionName = EventsDay.getCollectionName();
        const definitionData = { 
          day: item.Date,
           title: item.Task_Completed, 
           start: item.Time_Start || 0, 
           end: item.Time_End || 0, 
           min: item.Time_Spent, 
           type: item.Task_Type, 
           ml1: item.ML1, 
           ml2: item.ML2, 
           ml3: item.ML3, 
           section: item.Section_Number, 
           remarks: item.Remarks
          };
          

          defineMethod
            .callPromise({ collectionName, definitionData })
            .catch((error) => swal("Error", error.message, "error"))
            .then(() => {
              swal("Success", "Phase Lane added successfully", "success");
          });
          /*
          EventsDay.define(definitionData, (error, result) => {
            if (error) {
              swal("Error", error.message, "error");
            } else {
              swal("Success", "File imported successfully", "success");
              console.log(EventsDay.find().fetch());
              console.log(item);
            }
          });
          */

      });
    
      setShow(false);
      console.log(EventsDay.find().fetch());

    };
  }


  let fRef = null;
  return(
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
        <p>Select a file to upload:</p>
        <input type="file" onChange={handleFileSelect} />
        </Modal.Body>

        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>Cancel</Button>
          <Button variant="primary" onClick={handleFileUpload} disabled={!selectedFile}>Upload</Button>
        </Modal.Footer>

      </Modal>
    </>
  );

};

export default ImportButton;
