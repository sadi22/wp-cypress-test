import React, { useEffect, useRef, useState } from "react";
import { Link, matchPath, useLocation, useNavigate } from "react-router-dom";
import Delete from "../../components/Icons/Delete";
import DoubleAngleLeftIcon from "../../components/Icons/DoubleAngleLeftIcon";
import DownArrowIcon from "../../components/Icons/DownArrowIcon";
import InboxIcon from "../../components/Icons/InboxIcon";
import Plus from "../../components/Icons/Plus";
import SettingIcon from "../../components/Icons/SettingIcon";
import TemplateIcon from "../../components/Icons/TemplateIcon";
import UpArrowIcon from "../../components/Icons/UpArrowIcon";
import ListenForOutsideClicks from "../../components/ListenForOutsideClicks";
import SuccessfulNotification from "../../components/SuccessfulNotification";
import ToolTip from "../../components/ToolTip";
import useUnload from "../../components/Unload";
import { submitCampaign } from "../../services/Campaign";
import { ClearNotification } from "../../utils/admin-notification";
import { AdminNavMenuClassChange } from "../../utils/admin-settings";
import CampaignCustomSelect from "./CampaignCustomSelect";
import CampaignTemplates from "./CampaignTemplates";

// default email object empty template, this object is reused thats why declared here once
const defaultCampaignData = {
  subject: "",
  email_body: "",
  email_json: "",
  delay_count: 0,
  delay_value: "",
  preview: "",
  senderName: "",
  senderEmail: "",
  toError: null,
  senderEmailError: null,
};

export default function AddCampaign(props) {
  // Admin active menu selection
  AdminNavMenuClassChange("mrm-admin", "campaigns");
  const navigate = useNavigate();
  // state variable for holding each email sequence[s] data in an array
  const [emailData, setEmailData] = useState([{ ...defaultCampaignData }]);

  // tracks currently selected email index and highlights in the UI
  const [selectedEmailIndex, setSelectedEmailIndex] = useState(0);
  // campaign title state variable
  const [campaignTitle, setCampaignTitle] = useState("");

  // recipient lists and recipients tags state variables to whom the email(s) should be sent
  const [recipientLists, setRecipientLists] = useState([]);
  const [recipientTags, setRecipientTags] = useState([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [isClose, setIsClose] = useState(true);
  const [isTemplate, setIsTemplate] = useState(true);
  const [delay, setDelay] = useState();
  const [dropDown, setDropDown] = useState(false);
  const [errors, setErrors] = useState({});
  const [refresh, setRefresh] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [isPublishValid, setIsPublishValid] = useState(false);
  const [notificationType, setNotificationType] = useState("success");
  const [showNotification, setShowNotification] = useState("none");
  const [message, setMessage] = useState("");
  const [subjectCursorPosition, setSubjectCursorPosition] = useState(0 );
  const [prevCursorPosition, setPrevCursorPosition] = useState(0 );

  const menuRef = useRef(null);
  const [listening, setListening] = useState(false);
  useEffect(
    ListenForOutsideClicks(listening, setListening, menuRef, setDropDown)
  );

  const [previewPersonalization, setPreviewPersonalization] = useState(false);
  const [subjectPersonalization, setSubjectPersonalization] = useState(false);

  // Outside click events for bulk action dropdown
  const subjSettingsIconRef = useRef(null);
  useEffect(
      ListenForOutsideClicks( listening, setListening, subjSettingsIconRef, setSubjectPersonalization )
  );
  // Outside click events for bulk action dropdown
  const prevSettingsIconRef = useRef(null);
  useEffect(
      ListenForOutsideClicks( listening, setListening, prevSettingsIconRef, setPreviewPersonalization )
  );

  const [listAdder, setListAdder] = useState({
    lists: [],
    tags: [],
  });
  const names = [
    {
      value: "Minutes",
      id: "minutes",
    },
    {
      value: "Hours",
      id: "hours",
    },
    {
      value: "Days",
      id: "days",
    },
    {
      value: "Weeks",
      id: "weeks",
    },
  ];

  // Hide WordPress admin notices
  const location = useLocation();
  const match = matchPath({ path: "campaigns/create" }, location.pathname);
  if (match) {
    const elems = document.getElementsByClassName("notice");
    for (var i = 0; i < elems.length; i += 1) {
      elems[i].style.display = "none";
    }
  }

  // handler function for campaign title
  const handleTitleChange = async (event) => {
    const { name, value } = event.target;

    if( value.length > 150 ) {
      setErrors({
        ...errors,
        title: "Campaign title character limit exceeded 150 characters",
      });
    }else{
      setErrors({
        ...errors,
        title: "",
      });
      setCampaignTitle(value);
    }
  };

  // Prepare campaign object and send post request to backend
  const saveCampaign = async (status) => {
    const campaign = {
      title: campaignTitle,
      recipients: {
        lists: recipientLists.map((list) => {
          return {
            id: list.id,
            title: list.title,
          };
        }),
        tags: recipientTags.map((tag) => {
          return {
            id: tag.id,
            title: tag.title,
          };
        }),
      },
      type: emailData.length > 1 ? "sequence" : "regular",
      status: status,
      created_by: `${window.MRM_Vars.current_userID}`,
      emails: emailData.map((email) => {
        return {
          email_subject: email.subject,
          email_preview_text: email.preview,
          sender_email: email.senderEmail,
          delay_count: email.delay_count,
          delay_value: email.delay_value,
          sender_name: email.senderName,
          // email_body: email.email_body,
          email_body: "Dummy Email Body",
          email_json: email.email_json,
        };
      }),
    };

    setErrors({});
    
    submitCampaign(campaign).then((response) => {
      if (201 === response.code) {
        // Navigate to campaigns list with success message
        navigate("/campaign/edit/" + response.data.campaign.id, {
          state: { status: "campaign-created", message: response?.message },
        });
      } else {
        setNotificationType("warning");
        setShowNotification("block");
        setMessage(response?.message);
      }
      ClearNotification("none", setShowNotification);
    });
  };

  // function for adding new email in the sequence
  const addNextEmail = () => {
    setEmailData((prevEmailData) => {
      setSelectedEmailIndex(prevEmailData.length);
      return [...prevEmailData, { ...defaultCampaignData }];
    });
  };

  // function for removing an email from the sequence
  const deleteEmail = (index) => {
    setEmailData((prevEmailData) => {
      const copy = [...prevEmailData];
      copy.splice(index, 1);
      setSelectedEmailIndex(
        index < copy.length ? index : Math.max(0, index - 1)
      );
      return copy;
    });
  };

  const validateSenderEmail = (event, name, value) => {
    if (
      !new RegExp(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{1,}))$/
      ).test(value)
    ) {
      setErrors({
        ...errors,
        email: "Enter a valid email address",
      });
      return false;
    } else {
      setErrors({});
      return true;
    }
  };

  // handler function for each text field change in each email sequence
  const handleEmailFieldsChange = async (e) => {
    setEmailData((prevEmailData) => {
      const name = e.target.name;
      const value = e.target.value;
      const copy = [...prevEmailData];
      if ( 'subject' === name ) {
        setSubjectCursorPosition( e.target.selectionStart );
      }
      else if( 'preview' === name ) {
        setPrevCursorPosition( e.target.selectionStart );
      }
        if (name == "subject" || name == "preview") {
        if (value.length > 200) return copy;
      }
      if (name == "senderEmail") {
        validateSenderEmail(e, copy[selectedEmailIndex][name], value);
      }
      copy[selectedEmailIndex][name] = value;
      return copy;
    });
    validatePublish();
  };
  const openTemplate = async () => {
    setIsTemplate(true);
    setIsClose(!isClose);
  };
  const showTemplate = async () => {
    setShowTemplates(true);
  };

  const setEmailBody = async (data) => {
    const { design, html } = data;
    setEmailData((prevEmailData) => {
      const copy = [...prevEmailData];
      copy[selectedEmailIndex].email_body = html;
      copy[selectedEmailIndex].email_json = design;
      return copy;
    });
  };

  const showDropDown = () => {
    setDropDown(!dropDown);
  };

  const validate = () => {
    if (
      campaignTitle.length > 0 ||
      recipientLists.length != 0 ||
      recipientTags.length != 0 ||
      emailData[selectedEmailIndex]?.subject.length != 0 ||
      emailData[selectedEmailIndex]?.preview.length != 0 ||
      emailData[selectedEmailIndex]?.senderName.length != 0 ||
      emailData[selectedEmailIndex]?.senderEmail.length != 0 ||
      emailData[selectedEmailIndex].email_body.length != 0
    ) {
      return true;
    }
  };

  const validatePublish = () => {
    if (
      campaignTitle.length > 0 &&
      (recipientLists.length != 0 || recipientTags.length != 0) &&
      emailData[selectedEmailIndex]?.subject.length != 0 &&
      emailData[selectedEmailIndex]?.preview.length != 0 &&
      emailData[selectedEmailIndex]?.senderName.length != 0 &&
      emailData[selectedEmailIndex]?.senderEmail.length != 0 &&
      emailData[selectedEmailIndex].email_body.length != 0
    ) {
      return true;
    }
  };

  useEffect(() => {
    const isPublishValid = validatePublish();
    setIsPublishValid(isPublishValid);
    const isValid = validate();
    setIsValid(isValid);
  }, [
    campaignTitle,
    recipientLists,
    recipientTags,
    emailData[selectedEmailIndex]?.subject,
    emailData[selectedEmailIndex]?.preview,
    emailData[selectedEmailIndex]?.senderName,
    emailData[selectedEmailIndex]?.senderEmail,
    emailData[selectedEmailIndex]?.email_body,
    emailData[selectedEmailIndex]?.email_json,
  ]);

  useUnload((e) => {
    e.preventDefault();
    e.returnValue = "";
  });

  const deleteSelectedlist = (e, id) => {
    const index = recipientLists.findIndex((item) => item.id == id);

    // already in selected list so remove it from the array
    if (0 <= index) {
      setRecipientLists(recipientLists.filter((item) => item.id != id));
      setListAdder((prev) => ({
        ...prev,
        lists: prev.lists.filter((item) => {
          return item != id;
        }),
      }));
      // setFilterAdder(filterAdder.lists.filter((item) => item != id));
    }
  };
  const deleteSelectedtag = (e, id) => {
    const index = recipientTags.findIndex((item) => item.id == id);

    // already in selected list so remove it from the array
    if (0 <= index) {
      setRecipientTags(recipientTags.filter((item) => item.id != id));
      setListAdder((prev) => ({
        ...prev,
        tags: prev.tags.filter((item) => {
          return item != id;
        }),
      }));
    }
  };
  const deleteAll = () => {
    setRecipientLists([]);
    setRecipientTags([]);
    setListAdder({
      lists: [],
      tags: [],
    });
  };

  // Set email subject text custom tag/placeholder
  const handleSubjectPlaceholder = async (placeholder) => {
    const prevData = emailData[selectedEmailIndex]?.subject;
    const prevDataFirstHalf = prevData.substring( 0, subjectCursorPosition );
    const prevDataSecondHalf = prevData.substring( subjectCursorPosition, prevData.length );
    const newData = prevDataFirstHalf + placeholder + prevDataSecondHalf;
    setSubjectCursorPosition( subjectCursorPosition + placeholder.length );

    setEmailData((prevEmailData) => {
      const copy = [...prevEmailData];
      if (newData.length > 200) {
        return copy;
      }
      copy[selectedEmailIndex]["subject"] = newData;
      return copy;
    });
    validatePublish();
  };

  // Set email preview text custom tag/placeholder
  const handlePreviewPlaceholder = async (placeholder) => {
    const prevData = emailData[selectedEmailIndex]?.preview;
    const prevDataFirstHalf = prevData.substring( 0, prevCursorPosition );
    const prevDataSecondHalf = prevData.substring( prevCursorPosition, prevData.length );
    const newData = prevDataFirstHalf + placeholder + prevDataSecondHalf;
    setPrevCursorPosition( prevCursorPosition + placeholder.length );

    setEmailData((prevEmailData) => {
      const copy = [...prevEmailData];
      if (newData.length > 200) {
        return copy;
      }
      copy[selectedEmailIndex]["preview"] = newData;
      return copy;
    });
    validatePublish();
  };

  return (
    <>
      <div className="mintmrm-add-campaign">
        <div className="single-campaign-header">
          <div className="mintmrm-container">
            <div className="left-section">
              <div className="back-button">
                <Link to="/campaigns">
                  <DoubleAngleLeftIcon /> Campaigns
                </Link>
              </div>
              <h2 className="campaign-title">Add Campaign</h2>
            </div>
            <div className="right-section">
              {/* <button className="mrm-custom-select-btn">Month</button> */}
            </div>
          </div>
        </div>

        <div className="mintmrm-container">
          <div className="add-campaign-wrapper">
            <div className="add-email-section">
              {/**
               * loop through email data state and render the side buttons for each email sequence
               */}
              {emailData.map((email, index) => {
                return (
                  <div className="email-box" key={`emails-${index}`}>
                    <div
                      className={
                        selectedEmailIndex != index
                          ? "email-select-section"
                          : "email-select-section selected"
                      }
                      onClick={() => setSelectedEmailIndex(index)}
                    >
                      <div className="email-icon-section">
                        <InboxIcon />
                      </div>
                      <h5>Email {index + 1}</h5>
                      {index > 0 && (
                        <div
                          className="delete-option"
                          onClick={() => deleteEmail(index)}
                        >
                          <Delete />
                        </div>
                      )}
                    </div>
                    <div className="link-line"></div>
                  </div>
                );
              })}
              <div className="add-another-email" onClick={addNextEmail}>
                <Plus />
              </div>
            </div>
            <div className="email-content-section">
              <div className="email-container">
                {/**
                 * only shows the title and recipients list on first email sequnce form
                 */}
                {selectedEmailIndex == 0 && (
                  <>
                    <div className="email-title input-item">
                      <label>Title</label>
                      <input
                        type="text"
                        name="title"
                        value={campaignTitle}
                        onChange={(event) => handleTitleChange(event)}
                        placeholder="Enter Campaign title"
                      />
                      <p
                        className={
                          errors?.title
                            ? "error-message show"
                            : "error-message"
                        }
                      >
                        {errors?.title}
                      </p>
                    </div>
                    <div className="email-to input-item">
                      <div className="select-options" ref={menuRef}>
                        <label>To:</label>
                        {recipientLists.length == 0 &&
                        recipientTags.length == 0 ? (
                          <button
                            className="all-recipients"
                            onClick={showDropDown}
                          >
                            All Subscriber
                            {dropDown ? <UpArrowIcon /> : <DownArrowIcon />}
                          </button>
                        ) : (
                          <button
                            className="all-recipients selected show"
                            onClick={showDropDown}
                          >
                            <span className="tags">
                              {recipientTags.length} Tags
                            </span>
                            <span className="from">and</span>
                            <span className="lists">
                              {recipientLists.length} Lists.
                            </span>
                            {/* <span className="recipients">
                              {recipientLists.length + recipientTags.length}{" "}
                              Recipients
                            </span> */}
                            {dropDown ? <UpArrowIcon /> : <DownArrowIcon />}
                          </button>
                        )}

                        <CampaignCustomSelect
                          dropDown={dropDown}
                          setRecipientTags={setRecipientTags}
                          recipientTags={recipientTags}
                          setRecipientLists={setRecipientLists}
                          recipientLists={recipientLists}
                        />
                        <div></div>
                      </div>
                    </div>
                  </>
                )}
                {selectedEmailIndex > 0 && (
                  <>
                    <div className="email-delay input-item">
                      <label>Delay</label>
                      <div className="delay_count_input">
                        <div className="delay-input">
                          <input
                            type="number"
                            name="delay_count"
                            value={emailData[selectedEmailIndex]?.delay_count}
                            onChange={handleEmailFieldsChange}
                            min="0"
                            onKeyDown={(e) =>
                              ["e", "E", "+", "-"].includes(e.key) &&
                              e.preventDefault()
                            }
                          />
                          <p
                            className={
                              errors?.number
                                ? "error-message show"
                                : "error-message"
                            }
                          >
                            {errors?.number}
                          </p>
                        </div>

                        <select
                          onChange={handleEmailFieldsChange}
                          name="delay_value"
                          value={emailData[selectedEmailIndex]?.delay_value}
                        >
                          <option disabled={true} value="">
                            --Choose delay--
                          </option>
                          {names.map((item) => (
                            <option key={item.id}>{item.value}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </>
                )}
                <div className="email-subject input-item">
                  <label>Subject:</label>
                  <input
                    type="text"
                    name="subject"
                    value={emailData[selectedEmailIndex]?.subject}
                    onChange={handleEmailFieldsChange}
                    onClick={function ( e ) {
                      setSubjectCursorPosition( e.target.selectionStart )
                    }}
                    placeholder="Be Specific and concise to spark interest"
                  />
                  <span>
                    {emailData[selectedEmailIndex]?.subject.length}/200
                  </span>
                  <div className="setting-section" ref={subjSettingsIconRef}>
                    <div
                      onClick={() => {
                        setSubjectPersonalization((prev) => !prev);
                      }}
                    >
                      <SettingIcon />
                    </div>
                    <ul
                      className={
                        subjectPersonalization
                          ? "mintmrm-dropdown show"
                          : "mintmrm-dropdown"
                      }
                      ref={subjSettingsIconRef}
                    >
                      <div className="title">Personalization</div>
                      <li
                        onClick={handleSubjectPlaceholder.bind(
                          this,
                          "{{first_name}}"
                        )}
                      >
                        First name
                      </li>
                      <li
                        onClick={handleSubjectPlaceholder.bind(
                          this,
                          "{{last_name}}"
                        )}
                      >
                        Last Name
                      </li>
                      <li
                        onClick={handleSubjectPlaceholder.bind(
                          this,
                          "{{email}}"
                        )}
                      >
                        Email
                      </li>
                      <li
                        onClick={handleSubjectPlaceholder.bind(
                          this,
                          "{{city}}"
                        )}
                      >
                        City
                      </li>
                      <li
                        onClick={handleSubjectPlaceholder.bind(
                          this,
                          "{{state}}"
                        )}
                      >
                        State / Province
                      </li>
                      <li
                        onClick={handleSubjectPlaceholder.bind(
                          this,
                          "{{country}}"
                        )}
                      >
                        Country
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="email-preview input-item">
                  <label>Preview Text</label>
                  <input
                    type="text"
                    name="preview"
                    value={emailData[selectedEmailIndex]?.preview}
                    onChange={handleEmailFieldsChange}
                    onClick={function ( e ) {
                      setPrevCursorPosition( e.target.selectionStart )
                    }}
                    placeholder="Write a summary of your email to display after the subject line"
                  />
                  <span>
                    {emailData[selectedEmailIndex]?.preview.length}/200
                  </span>
                  <div className="setting-section" ref={prevSettingsIconRef}>
                    <div
                      onClick={() => {
                        setPreviewPersonalization((prev) => !prev);
                      }}
                    >
                      <SettingIcon />
                    </div>
                    <ul
                      className={
                        previewPersonalization
                          ? "mintmrm-dropdown show"
                          : "mintmrm-dropdown"
                      }
                    >
                      <div className="title">Personalization</div>
                      <li
                        onClick={handlePreviewPlaceholder.bind(
                          this,
                          "{{first_name}}"
                        )}
                      >
                        First name
                      </li>
                      <li
                        onClick={handlePreviewPlaceholder.bind(
                          this,
                          "{{last_name}}"
                        )}
                      >
                        Last Name
                      </li>
                      <li
                        onClick={handlePreviewPlaceholder.bind(
                          this,
                          "{{email}}"
                        )}
                      >
                        Email
                      </li>
                      <li
                        onClick={handlePreviewPlaceholder.bind(
                          this,
                          "{{city}}"
                        )}
                      >
                        City
                      </li>
                      <li
                        onClick={handlePreviewPlaceholder.bind(
                          this,
                          "{{state}}"
                        )}
                      >
                        State / Province
                      </li>
                      <li
                        onClick={handlePreviewPlaceholder.bind(
                          this,
                          "{{country}}"
                        )}
                      >
                        Country
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="email-from input-item">
                  <label>From</label>
                  <input
                    type="text"
                    name="senderName"
                    value={emailData[selectedEmailIndex]?.senderName}
                    onChange={handleEmailFieldsChange}
                    placeholder="Enter Name"
                  />
                  <div className="email-input">
                    <input
                      type="email"
                      name="senderEmail"
                      value={emailData[selectedEmailIndex]?.senderEmail}
                      onChange={handleEmailFieldsChange}
                      placeholder="Enter Email"
                    />
                    <p
                      className={
                        errors?.email ? "error-message show" : "error-message"
                      }
                    >
                      {errors?.email}
                    </p>
                  </div>
                </div>

                <div className="email-design input-item">
                  <label>Design</label>
                  <div className="add-template-section" onClick={openTemplate}>
                    <TemplateIcon />
                    <Link to="">Select a Template</Link>
                  </div>
                </div>
              </div>
              <div className="content-save-section">
                <ToolTip
                  title="Please complete all required steps to schedule the email."
                  containerClass="tooltipStyleChange"
                >
                  <button
                    className={
                      isPublishValid
                        ? "campaign-schedule mintmrm-btn outline"
                        : "campaign-schedule mintmrm-btn outline disable"
                    }
                    disabled={!isPublishValid}
                    data-tip="By adding this class you can provide almost any element with a tool tip."
                  >
                    Schedule
                  </button>
                </ToolTip>

                {/* <ScheduleAlert /> */}
                <button
                  type="submit"
                  className={
                    isValid
                      ? "campaign-save mintmrm-btn"
                      : "campaign-save mintmrm-btn disable"
                  }
                  onClick={() => saveCampaign("draft")}
                  disabled={!isValid}
                >
                  Save draft
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
      <CampaignTemplates
        refresh={refresh}
        setRefresh={setRefresh}
        isOpen={isTemplate}
        isClose={isClose}
        isNewCampaign={true}
        selectedEmailIndex={selectedEmailIndex}
        emailData={emailData[selectedEmailIndex]}
        setIsClose={setIsClose}
        setEmailBody={setEmailBody}
        setIsTemplate={setIsTemplate}
        campaignData={{
          title: campaignTitle,
          recipients: {
            lists: recipientLists.map((list) => {
              return {
                id: list.id,
                title: list.title,
              };
            }),
            tags: recipientTags.map((tag) => {
              return {
                id: tag.id,
                title: tag.title,
              };
            }),
          },
          type: emailData.length > 1 ? "sequence" : "regular",
          status: status,
          created_by: `${window.MRM_Vars.current_userID}`,
          emails: emailData.map((email) => {
            return {
              email_subject: email.subject,
              email_preview_text: email.preview,
              sender_email: email.senderEmail,
              delay_count: email.delay_count,
              delay_value: email.delay_value,
              sender_name: email.senderName,
              email_body: email.email_body,
              email_json: email.email_json,
            };
          }),
        }}
      />
    </>
  );
}
