import { default as React, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DoubleAngleLeftIcon from "../../components/Icons/DoubleAngleLeftIcon";
import DoubleAngleRightIcon from "../../components/Icons/DoubleAngleRightIcon";
import SingleCondition from "./SingleCondition";

const CreateSegment = () => {
  let navigate = useNavigate();
  const [preview, setPreview] = useState(false);
  const [segmentName, setSegmentName] = useState("");
  const [segmentDescription, setSegmentDescription] = useState("");
  const [errors, setErrors] = useState({});
  const [refresh, setRefresh] = useState();
  const [contactData, setContactData] = useState([]);
  const [matchDropdown, setMatchDropdown] = useState(false);
  const [segmentConditions, setSegmentConditions] = useState([
    {
      field_type: [
        {
          field_type_label: "Their email addresses",
          field_type_value: "their-email-addresses",
        },
        {
          field_type_label: "Their first names",
          field_type_value: "their-first-names",
        },
      ],
      field_condition: [
        {
          field_condition_label: "Are exactly",
          field_condition_value: "are-exactly",
        },
        {
          field_condition_label: "Are Not",
          field_condition_value: "are-not",
        },
      ],
      field_action: [
        {
          field_action_label: "Action 1",
          field_action_value: "action-1",
        },
        {
          field_action_label: "Action 2",
          field_action_value: "action-2",
        },
      ],
      field_action_input: "input-text",
      condition_logic: "and",
    },
  ]);

  const showMatchDropdown = () => {
    setMatchDropdown(!matchDropdown);
  };

  const handlePreview = () => {
    setPreview(!preview);
  };

  // Redirect to segments index page
  const routeChange = async () => {
    let path = `/segments`;
    navigate(path);
  };

  // Submit segmentation to the API
  const submitSegment = async () => {
    let segment = {
      title: segmentName,
      data: {
        description: segmentDescription,
        filters: [
          [
            {
              source: "email_addresses",
              operator: "contains",
              value: [],
            },
            {
              source: "last_name",
              operator: "contains",
              value: [],
            },
          ],
          [
            {
              source: "subscription_status",
              operator: "is",
              value: [],
            },
          ],
        ],
      },
    };

    submitSegment(segment).then((response) => {
      if (201 === response.code) {
        // Navigate to campaigns list with success message
        navigate("../segments", {
          state: { status: "segment-created", message: response?.message },
        });
      } else {
        // Validation messages
        setErrors({
          ...errors,
          title: response?.message,
        });
      }
    });
  };

  const addCondition = (value) => {
    setSegmentConditions((prevState) => {
      return [
        ...prevState,
        {
          field_type: [
            {
              field_type_label: "Their email addresses",
              field_type_value: "their-email-addresses",
            },
            {
              field_type_label: "Their first names",
              field_type_value: "their-first-names",
            },
          ],
          field_condition: [
            {
              field_condition_label: "Are exactly",
              field_condition_value: "are-exactly",
            },
            {
              field_condition_label: "Are Not",
              field_condition_value: "are-not",
            },
          ],
          field_action: [
            {
              field_action_label: "Action 1",
              field_action_value: "action-1",
            },
            {
              field_action_label: "Action 2",
              field_action_value: "action-2",
            },
          ],
          field_action_input: "input-text",
          condition_logic: value,
        },
      ];
    });
  };

  const deleteCondition = (index) => {
    setSegmentConditions([
      ...segmentConditions.slice(0, index),
      ...segmentConditions.slice(index + 1, segmentConditions.length),
    ]);
  };

  return (
    <>
      <div className="add-segment-page">
        <Link to="/segments">
          <button className="backto-segment">
            <DoubleAngleLeftIcon />
            Back
          </button>
        </Link>

        <h4 className="add-segment-title">Add Segment</h4>

        <div className="segment-wrapper">
          <div className="segment-header">
            <div className="form-group">
              <label htmlFor="">Segment Name</label>
              <input
                type="text"
                name="segment_name"
                placeholder="Enter segment name"
                value={segmentName}
                onChange={(e) => setSegmentName(e.target.value)}
              />
              <p
                className={
                  errors?.title ? "error-message show" : "error-message"
                }
              >
                {errors?.title}
              </p>
            </div>

            <div className="form-group">
              <label htmlFor="">Segment Description</label>
              <input
                type="text"
                name="segment_description"
                placeholder="Enter segment description"
                value={segmentDescription}
                onChange={(e) => setSegmentDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="condition-matching">
            <b>Match</b>
            <div
              className={
                matchDropdown
                  ? "mrm-custom-select-container show-dropdown"
                  : "mrm-custom-select-container"
              }
            >
              <button
                className="mrm-custom-select-btn"
                type="button"
                onClick={() => showMatchDropdown()}
              >
                All
              </button>
              <ul className="mintmrm-dropdown mrm-custom-select-dropdown">
                <li value="all">All</li>
                <li value="any">Any</li>
              </ul>
            </div>
            of the following conditions:
          </div>

          <div className="segment-condition-wrapper">
            {segmentConditions.map((segmentCondition, idx) => {
              return (
                <SingleCondition
                  key={idx}
                  index={idx}
                  conditionsLength={segmentConditions.length}
                  segmentCondition={segmentCondition}
                  addCondition={addCondition}
                  deleteCondition={deleteCondition}
                />
              );
            })}
          </div>

          <button
            className="preview-segment"
            title="Click to Preview Contacts"
            onClick={handlePreview}
          >
            Preview Segment
            <DoubleAngleRightIcon />
          </button>
        </div>

        {preview && (
          <div className="preview-contact-wrapper">
            <div className="contact-list-header">
              <h4>2 Contacts</h4>
            </div>

            <div className="preview-contact-list">
              <div className="contact-list-area">
                <div className="contact-list-body">
                  {/* <ContactListTable refresh={refresh} setRefresh={setRefresh} /> */}
                  <div className="contact-list-table">
                    <table>
                      <thead>
                        <tr>
                          <th className="email">Email</th>
                          <th className="first-name">First Name</th>
                          <th className="last-name">Last Name</th>
                          <th className="list">Lists</th>
                          <th className="tag">Tags</th>
                          <th className="status">Status</th>
                          <th className="action"></th>
                        </tr>
                      </thead>

                      <tbody>
                        {contactData.map((contact, idx) => {
                          return (
                            <SingleContact
                              key={idx}
                              contact={contact}
                              toggleRefresh={toggleRefresh}
                              currentActive={currentActive}
                              setCurrentActive={setCurrentActive}
                              handleSelectOne={handleSelectOne}
                              selected={selected}
                              columns={columns}
                            />
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="save-btn-area">
          <button className="mintmrm-btn cancel" onClick={routeChange}>
            {" "}
            Cancel{" "}
          </button>
          <button className="mintmrm-btn save" onClick={submitSegment}>
            {" "}
            Save{" "}
          </button>
        </div>
      </div>
    </>
  );
};

export default CreateSegment;
