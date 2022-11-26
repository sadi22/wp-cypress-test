import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DragAndDrop from "../components/DragAndDrop";
import ImportSVG from "../components/Icons/ImportSVG";
import ImportNavbar from "../components/Import/ImportNavbar";
import SuccessfulNotification from "../components/SuccessfulNotification";
import { ClearNotification } from "../utils/admin-notification";
import { AdminNavMenuClassChange } from "../utils/admin-settings";
export default function ImportContactFile() {
  // Admin active menu selection
  AdminNavMenuClassChange("mrm-admin", "contacts");
  const navigate = useNavigate();
  // stores the selected file reference
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [notificationType, setNotificationType] = useState("success");
  const [showNotification, setShowNotification] = useState("none");
  const uploadRef = useRef(null);

  // sets the file reference on file select
  function handleChange(event) {
    setFile(event.target.files[0]);
  }

  // handle drop file
  function handleDrop(files) {
    try {
      const droppedFile = files[0];
      if (droppedFile.type == "text/csv") {
        setFile(droppedFile);
      } else {
        setNotificationType("warning");
        setShowNotification("block");
        setMessage("File Format Not Supported.");
        ClearNotification("none", setShowNotification);
      }
    } catch (e) {}
  }

  // open upload picker while clicking on click to upload
  function openUploadPicker() {
    uploadRef.current.click();
  }

  async function uploadCSV() {
    let formData = new FormData();
    formData.append("csv", file);
    let options = {
      method: "POST",
      body: formData,
    };
    const res = await fetch(
      `${window.MRM_Vars.api_base_url}mrm/v1/contacts/import/csv/attrs`,
      options
    );
    const resJson = await res.json();
    if (resJson.code == 200) {
      navigate("/contacts/import/csv/map", {
        state: {
          data: resJson.data,
          type: "csv",
        },
      });
    } else {
      setNotificationType("warning");
      setShowNotification("block");
      setMessage(resJson?.message);
      ClearNotification("none", setShowNotification);
    }
  }
  const routeChange = () => {
    let path = `/contacts`;
    navigate(path);
  };
  return (
    <>
      <div className="mintmrm-import-page">
        <div className="mintmrm-header">
          <div className="contact-details-breadcrumb import-contact-breadcrum">
            <div className="import-cotainer">
              <div className="mintmrm-container">
                <ul className="mintmrm-breadcrumb">
                  <li>
                    <Link to={`../contacts`}>Contact</Link>
                  </li>
                  <li className="active">Import</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mintmrm-container">
          <div className="import-wrapper">
            <ImportNavbar />

            <div className="import-tabs-content upload-section">
              <h3>Upload CSV File</h3>
              <span className="csv-title">
                This file needs to be formatted in a CSV style
                (comma-separated-values.)
                <a href=""> Look at some examples on our support site.</a>
              </span>
              <DragAndDrop handleDrop={handleDrop}>
                <div className="file-upload-section ">
                  <ImportSVG />
                  <span>
                    <span
                      className="click-to-upload-text"
                      onClick={openUploadPicker}
                    >
                      Click to upload{" "}
                    </span>
                    {file ? file.name : "or drag and drop"}
                  </span>
                  <span className="click-to-upload"></span>
                  <div className="click-to-upload">
                    <input
                      name="csv"
                      type="file"
                      onChange={handleChange}
                      accept=".csv"
                      className="mrm-hide-element"
                      ref={uploadRef}
                    />
                  </div>
                </div>
              </DragAndDrop>
              <div className="csv-save-button">
                <button
                  className="contact-cancel mintmrm-btn outline"
                  onClick={routeChange}
                >
                  Cancel
                </button>
                <button
                  className="contact-save mintmrm-btn"
                  onClick={uploadCSV}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SuccessfulNotification
        display={showNotification}
        setShowNotification={setShowNotification}
        notificationType={notificationType}
        setNotificationType={setNotificationType}
        message={message}
      />
    </>
  );
}
