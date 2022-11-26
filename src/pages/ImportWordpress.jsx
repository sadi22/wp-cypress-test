import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ColumnItems from "../components/ContactDetails/ColumnItems";
import ImportNavbar from "../components/Import/ImportNavbar";
import SuccessfulNotification from "../components/SuccessfulNotification";
import { getWordPressRoles, submitWordPressRoles } from "../services/Import";
import { ClearNotification } from "../utils/admin-notification";
import { AdminNavMenuClassChange } from "../utils/admin-settings";

export default function ImportWordpress() {
  // Admin active menu selection
  AdminNavMenuClassChange("mrm-admin", "contacts");
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  // The select all checkbox
  const [allSelected, setAllSelected] = useState(false);
  // single selected array which holds selected roles ids
  const [selected, setSelected] = useState([]);
  const [message, setMessage] = useState("");
  const [notificationType, setNotificationType] = useState("success");
  const [showNotification, setShowNotification] = useState("none");

  //Fetch roles from the native WordPress
  useEffect(() => {
    getWordPressRoles().then((response) => {
      setRoles(response);
    });
  }, []);

  // Handle all checkbox selection
  const handleSelectAll = (event) => {
    if (allSelected) {
      setSelected([]);
    } else {
      setSelected(roles.map((role) => role.role));
    }
    setAllSelected(!allSelected);
  };

  // Handle single role selection and set to an array state
  const handleSelectOne = (event) => {
    if (selected.includes(event.target.id)) {
      // already in selected list so remove it from the array
      setSelected(selected.filter((element) => element != event.target.id));
      // corner case where one item is deselected so hide all checked
      setAllSelected(false);
    } else {
      // add id to the array
      setSelected([...selected, event.target.id]);
    }
  };

  const handleSave = (event) => {
    submitWordPressRoles(selected).then((response) => {
      if (201 == response.code) {
        navigate("/contacts/import/wordpress/map", {
          state: {
            data: response.data,
            type: "native-wp",
          },
        });
      } else {
        setNotificationType("warning");
        setShowNotification("block");
        setMessage(response?.message);
        ClearNotification("none", setShowNotification);
      }
    });
  };

  // Redirect to contacts list view
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
              <h3>Import from WordPress</h3>
              <span className="csv-title">
                Select the user roles that you want to import as contact
              </span>
              <div className="wordpress-import-section">
                <p>Select User Roles</p>
                <div className="mintmrm-checkbox">
                  <input
                    type="checkbox"
                    name="all-user-roles"
                    id="all-user-roles"
                    onChange={handleSelectAll}
                    checked={allSelected}
                  />
                  <label for="all-user-roles">All user roles</label>
                </div>
                {roles.map((role) => {
                  return (
                    <div className="mintmrm-checkbox" key={role.role}>
                      <ColumnItems
                        name={role.role}
                        id={role.role}
                        title={role.name}
                        selected={selected}
                        handleSelectOne={handleSelectOne}
                      />
                    </div>
                  );
                })}
              </div>

              <div className="csv-save-button">
                {/* {selectedLists.length > 0 && (
                <button className="contact-save mintmrm-btn" onClick={getLists}>
                  Save
                </button>
              )} */}
                <button
                  className="contact-cancel mintmrm-btn outline"
                  onClick={routeChange}
                >
                  Cancel
                </button>
                <button
                  className="contact-save mintmrm-btn"
                  onClick={handleSave}
                >
                  Save
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
