import React, { useEffect, useRef, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { getLists } from "../services/List";
import { getTags } from "../services/Tag";
import { ClearNotification } from "../utils/admin-notification";
import ImportNavbar from "./Import/ImportNavbar";
import Select from "./Import/Select";
import ListenForOutsideClicks from "./ListenForOutsideClicks";
import SuccessfulNotification from "./SuccessfulNotification";

export default function WordPressFieldMap() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // holds selectbox currently selected lists
  const [lists, setLists] = useState([]);
  // holds selectbox currently selected tags
  const [tags, setTags] = useState([]);
  const [message, setMessage] = useState("");
  const [notificationType, setNotificationType] = useState("success");
  const [showNotification, setShowNotification] = useState("none");
  const [contacts, setContacts] = useState([]);
  const [isActiveStatus, setIsActiveStatus] = useState(false);
  const [isActiveList, setIsActiveList] = useState(false);
  const [isActiveTag, setIsActiveTag] = useState(false);
  const [selectedLists, setSelectedLists] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState();
  //Detect Outside Click to Hide Dropdown Element
  const statusMenuRef = useRef(null);
  const listMenuRef = useRef(null);
  const tagMenuRef = useRef(null);
  const [listening, setListening] = useState(false);
  useEffect(
    ListenForOutsideClicks(
      listening,
      setListening,
      statusMenuRef,
      setIsActiveStatus
    )
  );
  useEffect(
    ListenForOutsideClicks(
      listening,
      setListening,
      listMenuRef,
      setIsActiveList
    )
  );
  useEffect(
    ListenForOutsideClicks(listening, setListening, tagMenuRef, setIsActiveTag)
  );

  // get the state from calling component
  const state = location.state;

  // if current path is /contacts/import/csv/map replace the map and send back to /contacts/import/csv
  // this url will also be used for posting fetch request endpoint /contacts/import/csv for file and /contacts/import/raw for raw data
  const returnUrl = location.pathname.replace("/map", "");

  //   if no data is recieved through state object
  //   force redirect to previous import page
  if (!state) {
    return <Navigate to={returnUrl} />;
  }

  // get the state data from calling component
  //   const { contacts } = state.data;

  useEffect(() => {
    // Get lists
    getLists().then((results) => {
      results.data.map(function () {
        setLists(results.data);
      });
    });

    // Get tags
    getTags().then((results) => {
      setTags(results.data);
    });

    if ("native-wp" == location.state?.type) {
      setContacts(location.state?.data);
    }
  }, []);
  const importContacts = async () => {
    setLoading(true);
    const body = {
      contacts: contacts,
    };

    body.status = [selectedStatus];
    body.lists = selectedLists;
    body.tags = selectedTags;
    body.created_by = `${window.MRM_Vars.current_userID}`;
    try {
      let res = await fetch(
        `${window.MRM_Vars.api_base_url}mrm/v1/contacts/insert/wordpress`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );
      let resJson = await res.json();
      if (resJson.code == 201) {
        navigate("/contacts/import/confirmation", {
          state: { data: resJson.data },
        });
      } else {
        setNotificationType("warning");
        setShowNotification("block");
        setMessage(resJson?.message);
      }
      setLoading(false);
      ClearNotification("none", setShowNotification);
    } catch (e) {
      window.alert(e.message);
      setLoading(false);
    }
  };

  const handleTag = () => {
    setIsActiveTag(!isActiveTag);
    setIsActiveList(false);
    setIsActiveStatus(false);
  };

  const handleList = () => {
    setIsActiveList(!isActiveList);
  };

  const handleStatus = () => {
    setIsActiveStatus(!isActiveStatus);
    setIsActiveTag(false);
    setIsActiveList(false);
  };

  const capitalizeFirst = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleSelectStatus = (title) => {
    if ("Pending" == title) {
      setSelectedStatus("pending");
    } else if ("Subscribe" == title) {
      setSelectedStatus("subscribed");
    } else {
      setSelectedStatus("unsubscribed");
    }
    setIsActiveStatus(false);
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
                    <a href="">Contact</a>
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
              <h3>Select Fields to Map</h3>
              <span className="csv-title">
                Select which fields you wish to synchronize to their
                destinations.
              </span>
              <form className="select-field-form" action="">
                <div className="select-field-table">
                  <table>
                    <thead>
                      <tr>
                        <th>WordPress ID</th>
                        <th>Name</th>
                        <th>Username</th>
                        <th>Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contacts?.map((contact) => {
                        return (
                          <tr key={contact.id}>
                            <td>{contact.id}</td>
                            <td>
                              {contact.first_name} {contact.last_name}
                            </td>
                            <td>{contact.user_login}</td>
                            <td>{contact.user_email}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="profile-section">
                  <h3>Contact Profile</h3>

                  <div className="contact-profile">
                    <div
                      className="form-group status-dropdown"
                      ref={statusMenuRef}
                    >
                      <label>Status</label>
                      <button
                        type="button"
                        className={
                          isActiveStatus
                            ? "drop-down-button show"
                            : "drop-down-button"
                        }
                        onClick={handleStatus}
                      >
                        {selectedStatus
                          ? capitalizeFirst(selectedStatus)
                          : "Select Status"}
                      </button>
                      <ul
                        className={
                          isActiveStatus
                            ? "add-contact-status mintmrm-dropdown show"
                            : "add-contact-status mintmrm-dropdown"
                        }
                      >
                        <li onClick={() => handleSelectStatus("Pending")}>
                          Pending
                        </li>
                        <li onClick={() => handleSelectStatus("Subscribe")}>
                          Subscribe
                        </li>
                        <li onClick={() => handleSelectStatus("Unsubscribe")}>
                          Unsubscribe
                        </li>
                      </ul>
                    </div>
                    <div className="form-group status-dropdown">
                      <label>Lists</label>
                      <div
                        className="mrm-custom-select-container"
                        key="container"
                      >
                        <button
                          type="button"
                          className="mrm-custom-select-btn show"
                          onClick={handleList}
                          ref={listMenuRef}
                        >
                          Select Lists
                        </button>
                        <Select
                          isActive={isActiveList}
                          setIsActive={setIsActiveList}
                          selected={selectedLists}
                          setSelected={setSelectedLists}
                          endpoint="/lists"
                          placeholder="Lists"
                          name="list"
                          listTitle="CHOOSE LIST"
                          listTitleOnNotFound="No Data Found"
                          searchPlaceHolder="Search..."
                          allowMultiple={true}
                          showSearchBar={true}
                          showListTitle={false}
                          showSelectedInside={false}
                          allowNewCreate={true}
                        />
                      </div>
                    </div>
                    <div className="form-group status-dropdown">
                      <label>Tags</label>
                      <div
                        className="mrm-custom-select-container"
                        key="container"
                      >
                        <button
                          type="button"
                          className="mrm-custom-select-btn show"
                          onClick={handleTag}
                          ref={tagMenuRef}
                        >
                          Select Tags
                        </button>
                        <Select
                          isActive={isActiveTag}
                          setIsActive={setIsActiveTag}
                          selected={selectedTags}
                          setSelected={setSelectedTags}
                          endpoint="/tags"
                          placeholder="Tags"
                          name="list"
                          listTitle="CHOOSE TAG"
                          listTitleOnNotFound="No Data Found"
                          searchPlaceHolder="Search..."
                          allowMultiple={true}
                          showSearchBar={true}
                          showListTitle={false}
                          showSelectedInside={false}
                          allowNewCreate={true}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </form>

              <div className="import-button">
                <Link to={returnUrl}>
                  <button className="mintmrm-btn outline cancel-btn">
                    Cancel
                  </button>
                </Link>

                <button
                  className="import-confirm-button mintmrm-btn"
                  onClick={() => importContacts()}
                  loading={loading}
                >
                  Import
                  {loading && (
                    <span
                      className="mintmrm-loader"
                      style={{ display: "block" }}
                    ></span>
                  )}
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
