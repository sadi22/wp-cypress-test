import React, { useEffect, useRef, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { getLists } from "../services/List";
import { getTags } from "../services/Tag";
import { ClearNotification } from "../utils/admin-notification";
import ImportNavbar from "./Import/ImportNavbar";
import Select from "./Import/Select";
import ListenForOutsideClicks from "./ListenForOutsideClicks";
import SelectDropdown from "./SelectDropdown";
import SuccessfulNotification from "./SuccessfulNotification";
export default function SelectFieldsMap() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  // holds map state
  const [mapState, setMapState] = useState([]);

  // holds selectbox currently selected lists
  const [lists, setLists] = useState([]);
  // holds selectbox currently selected tags
  const [tags, setTags] = useState([]);
  const [message, setMessage] = useState("");
  const [notificationType, setNotificationType] = useState("success");
  const [showNotification, setShowNotification] = useState("none");
  const [selectedStatus, setSelectedStatus] = useState();
  const [isActiveStatus, setIsActiveStatus] = useState(false);
  const [isActiveList, setIsActiveList] = useState(false);
  const [isActiveTag, setIsActiveTag] = useState(false);
  const [selectedLists, setSelectedLists] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

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
  const { fields, headers } = state.data;

  // determine which type of import the previous screen was either it will be "raw" or "csv"
  const type = state.type;

  const map = [];

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
  }, []);
  const importContacts = async () => {
    setLoading(true);
    const body = {
      map: mapState, // current mapping from file
    };
    // send the filename in case of csv file upload otherwise send the raw data
    if (type == "csv") {
      body.file = state.data.file;
    } else if (type == "raw") {
      body.raw = state.data.raw;
    }
    body.status = [selectedStatus];
    body.lists = selectedLists;
    body.tags = selectedTags;
    body.created_by = `${window.MRM_Vars.current_userID}`;
    try {
      let res = await fetch(
        `${window.MRM_Vars.api_base_url}mrm/v1${returnUrl}`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );
      let resJson = await res.json();

      if (resJson.code == 200) {
        navigate("/contacts/import/confirmation", {
          state: { data: resJson.data },
        });
      } else {
        setNotificationType("warning");
        setShowNotification("block");
        setMessage(resJson.message);
      }
      setLoading(false);
      ClearNotification("none", setShowNotification);
    } catch (e) {
      setLoading(false);
    }
  };

  // selectbox options for rendering
  const selectOptions = fields.map((item) => ({
    title: item.name,
    id: item.slug,
  }));
  selectOptions.push({
    title: "Do not import this field",
    id: "no_import",
  });

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

  // handle selectbox and prepare the mapping
  function onSelect(field_id, field_name, field_value) {
    const selectedValue = field_id;
    const idx = map.findIndex((item) => item.source == field_value);
    if (selectedValue == "no_import") {
      mapState.filter((item) => item.source != field_value);
      return;
    }
    if (idx != -1) {
      // mapping already exists so update the map
      map[idx]["source"] = field_value;
      map[idx]["target"] = selectedValue;
    } else {
      setMapState([
        ...mapState,
        {
          source: field_value,
          target: selectedValue,
        },
      ]);
    }
  }

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
                        <th>Column To Import</th>
                        <th>Map Into Field</th>
                      </tr>
                    </thead>
                    <tbody>
                      {headers.map((header, idx) => {
                        return (
                          <tr key={idx}>
                            <td>{header}</td>
                            <td>
                              <div className="form-group map-dropdown">
                                <SelectDropdown
                                  handleSelect={onSelect}
                                  field_value={header}
                                  options={selectOptions}
                                />
                              </div>
                            </td>
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
                  onClick={() => importContacts(map)}
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
