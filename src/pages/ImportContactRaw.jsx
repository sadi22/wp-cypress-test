import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ImportNavbar from "../components/Import/ImportNavbar";
import SuccessfulNotification from "../components/SuccessfulNotification";
import { ClearNotification } from "../utils/admin-notification";
import { AdminNavMenuClassChange } from "../utils/admin-settings";

export default function ImportContactRaw() {
  // Admin active menu selection
  AdminNavMenuClassChange("mrm-admin", "contacts");
  const navigate = useNavigate();
  // stores the text data
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");
  const [notificationType, setNotificationType] = useState("success");
  const [showNotification, setShowNotification] = useState("none");

  // ref for referring textarea
  const textAreaRef = useRef(null);

  // sets the file text from textarea reference on textarea change
  function handleChange(event) {
    setText(event.target.value);
  }

  async function uploadRawData() {
    let options = {
      method: "POST",
      body: JSON.stringify({
        raw: textAreaRef.current.value,
      }),
      headers: {
        "Content-type": "application/json",
      },
    };

    const res = await fetch(
      `${window.MRM_Vars.api_base_url}mrm/v1/contacts/import/raw/attrs`,
      options
    );
    const resJson = await res.json();
    if (resJson.code == 200) {
      navigate("/contacts/import/raw/map", {
        state: {
          data: resJson.data,
          type: "raw", // indicated the type of import
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
              <h3>Paste Your Data</h3>
              <span className="csv-title">
                This file needs to be formatted in a CSV style
                (comma-separated-values.)
                <a href="#"> Look at some examples on our support site.</a>
              </span>
              <textarea
                className="raw-textarea"
                ref={textAreaRef}
                onChange={handleChange}
                placeholder={`(Example Data)
Email, First Name, Last Name
john@doe.com, John, Doe
mary@smith.com, Mary, Smith
johnny@walker.com, Johny, Walker
                  `}
              ></textarea>
              <span className="csv-title">
                Type or paste your existing contacts in this box
              </span>
              <div className="csv-save-button">
                <button
                  className="contact-cancel mintmrm-btn outline"
                  onClick={routeChange}
                >
                  Cancel
                </button>
                <button
                  className="contact-save mintmrm-btn"
                  onClick={uploadRawData}
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
