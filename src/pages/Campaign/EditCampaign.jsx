import React, { useEffect, useRef, useState } from "react";
import { Link, matchPath, useLocation, useParams } from "react-router-dom";
import DeletePopup from "../../components/DeletePopup";
import Delete from "../../components/Icons/Delete";
import DoubleAngleLeftIcon from "../../components/Icons/DoubleAngleLeftIcon";
import DownArrowIcon from "../../components/Icons/DownArrowIcon";
import InboxIcon from "../../components/Icons/InboxIcon";
import Plus from "../../components/Icons/Plus";
import SettingIcon from "../../components/Icons/SettingIcon";
import TemplateIcon from "../../components/Icons/TemplateIcon";
import UpArrowIcon from "../../components/Icons/UpArrowIcon";
import ListenForOutsideClicks from "../../components/ListenForOutsideClicks";
import LoadingIndicator from "../../components/LoadingIndicator";
import PublishAlert from "../../components/PublishAlert";
import SuccessfulNotification from "../../components/SuccessfulNotification";
import ToolTip from "../../components/ToolTip";
import useUnload from "../../components/Unload";
import {
  deleteCampaignEmail,
  updateCampaignRequest,
} from "../../services/Campaign";
import { ClearNotification } from "../../utils/admin-notification";
import { AdminNavMenuClassChange } from "../../utils/admin-settings";
import CampaignCustomSelect from "./CampaignCustomSelect";
import CampaignTemplates from "./CampaignTemplates";

// default email object empty template, this object is reused thats why declared here once
const defaultEmailData = {
  email_subject: "",
  email_body: "",
  email_json: "",
  delay_count: 0,
  delay_value: "",
  email_preview_text: "",
  sender_name: "",
  sender_email: "",
  toError: null,
  senderEmailError: null,
};

export default function EditCampaign(props) {
  // Admin active menu selection
  AdminNavMenuClassChange("mrm-admin", "campaigns");
  // state variable for holding each email sequence[s] data in an array
  const [emailData, setEmailData] = useState([{ ...defaultEmailData }]);
  const [activeEmailData, setActiveEmailData] = useState(defaultEmailData);
  const [showNotification, setShowNotification] = useState("none");
  const [notificationType, setNotificationType] = useState("success");
  const [message, setMessage] = useState("");
  // tracks currently selected email index and highlights in the UI
  const [selectedEmailIndex, setSelectedEmailIndex] = useState(0);
  // campaign title state variable
  const [campaignTitle, setCampaignTitle] = useState("");
  const [recipientsCount, satRecipientsCount] = useState(0);

  // recipient lists and recipients tags state variables to whom the email(s) should be sent
  const [recipientLists, setRecipientLists] = useState([]);
  const [recipientTags, setRecipientTags] = useState([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [isClose, setIsClose] = useState(true);
  const [isTemplate, setIsTemplate] = useState(true);
  const [isEmailDelete, setIsEmailDelete] = useState("none");
  const [deleteTitle, setDeleteTitle] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");
  const [emailID, setEmailID] = useState();
  const [emailIndex, setEmailIndex] = useState();
  const [refresh, setRefresh] = useState(true);
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const [isPublishValid, setIsPublishValid] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [campaignStatus, setCampaignStatus] = useState("");
  const [isReadonly, setIsReadonly] = useState(false);
  const [isPublish, setIsPublish] = useState("none");
  const [listAdder, setListAdder] = useState({
    lists: [],
    tags: [],
  });

  const menuRef = useRef(null);
  const [listening, setListening] = useState(false);
  useEffect(
    ListenForOutsideClicks(listening, setListening, menuRef, setDropDown)
  );

  // get the campaign id from url
  const { id } = useParams();
  const location = useLocation();

  const [previewPersonalization, setPreviewPersonalization] = useState(false);
  const [subjectPersonalization, setSubjectPersonalization] = useState(false);

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
  const match = matchPath({ path: "campaign/edit/:id" }, location.pathname);
  if (match) {
    const elems = document.getElementsByClassName("notice");
    for (var i = 0; i < elems.length; i += 1) {
      elems[i].style.display = "none";
    }
  }

  // handler function for campaign title
  const handleTitleChange = async (event) => {
    setIsValid(true);
    const { name, value } = event.target;

    if( value?.length > 150 ) {
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

  // fetch campaign data
  const fetchCampaignData = async () => {
    const response = await fetch(`/wp-json/mrm/v1/campaigns/${id}`);
    return await response.json();
  };

  // the data is fetched again whenver refresh is changed
  function toggleRefresh() {
    setRefresh((prev) => !prev);
  }

  useEffect(() => {
    fetchCampaignData().then((res) => {
      let campaign = res.data,
        emails =
          campaign?.emails?.length > 0
            ? campaign.emails
            : [{ ...defaultEmailData }];
      setRecipientLists(campaign?.meta?.recipients?.lists);
      setRecipientTags(campaign?.meta?.recipients?.tags);
      setEmailData(emails);
      setActiveEmailData(emails[0]);
      setSelectedEmailIndex(0);
      setCampaignTitle(campaign.title);
      setCampaignStatus(campaign.status);
      satRecipientsCount(campaign.total_recipients);
      setShowLoader(false);
      if ("active" == campaign.status || "archived" == campaign.status) {
        setIsReadonly(true);
      }

      const isPublishValid = validateCampaignPublish(
        emails,
        campaign.title,
        campaign.meta.recipients?.lists,
        campaign.meta.recipients?.tags
      );
      setIsPublishValid(isPublishValid);
    });

    if ("campaign-created" == location.state?.status) {
      setNotificationType("success");
      setShowNotification("block");
      setMessage(location.state?.message);
    }
    ClearNotification("none", setShowNotification);
  }, [refresh]);

  const validateSenderEmail = (name, value) => {
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

  const publishCampaignNow = async () => {
    setIsPublish("block");
  };

  // Prepare campaign object and send post request to backend
  const updateCampaign = async (status) => {
    if (campaignTitle.length < 3) {
      alert("Please enter at least 3 characters for the campaign title.");
      return;
    }

    const campaign = {
      title: campaignTitle,
      recipients: {
        lists: recipientLists?.map((list) => {
          return {
            id: list.id,
            title: list.title,
          };
        }),
        tags: recipientTags?.map((tag) => {
          return {
            id: tag.id,
            title: tag.title,
          };
        }),
      },
      type: emailData.length > 1 ? "sequence" : "regular",
      status: status == "active" ? "active" : status,
      emails: emailData.map((email) => {
        return {
          id: email?.id,
          email_subject: email.email_subject,
          email_preview_text: email.email_preview_text,
          sender_email: email.sender_email,
          delay_count: email.delay_count,
          delay_value: email.delay_value,
          sender_name: email.sender_name,
          // email_body: email.email_body,
          email_body: "Dummy Email Body",
          email_json: email.email_json,
        };
      }),
      campaign_id: id,
    };
    setErrors({});
    updateCampaignRequest(campaign).then((response) => {
      if (201 === response.code) {
        // Show success message
        setNotificationType("success");
        setShowNotification("block");
        setMessage(response?.message);
        toggleRefresh();
      } else {
        setNotificationType("warning");
        setShowNotification("block");
        setMessage(response?.message);
      }
    });

    const isValid = validate();
    setIsValid(isValid);
    ClearNotification("none", setShowNotification);
  };

  const validate = () => {
    if (
      campaignTitle.length > 0 ||
      recipientLists?.length != 0 ||
      recipientTags?.length != 0 ||
      emailData[selectedEmailIndex]["email_subject"]?.length != 0 ||
      emailData[selectedEmailIndex]["email_preview_text"]?.length != 0 ||
      emailData[selectedEmailIndex]["sender_name"]?.length != 0 ||
      emailData[selectedEmailIndex]["sender_email"]?.length != 0 ||
      emailData[selectedEmailIndex].email_body?.length != 0
    ) {
      return true;
    }
  };

  const validatePublish = (email) => {
    if (
      campaignTitle.length > 0 &&
      recipientLists?.length != 0 &&
      recipientTags?.length != 0 &&
      email.email_subject?.length != 0 &&
      email.email_preview_text?.length != 0 &&
      email.sender_name?.length != 0 &&
      email.sender_email?.length != 0 &&
      email.email_body?.length != 0
    ) {
      return true;
    }
  };

  const validateCampaignPublish = (
    emails,
    campaignTitle,
    recipientLists,
    recipientTags
  ) => {
    emails.map((email) => {
      if (
        campaignTitle.length < 0 ||
        recipientLists?.length == 0 ||
        recipientTags?.length == 0 ||
        email.email_subject?.length == 0 ||
        email.email_preview_text?.length == 0 ||
        email.sender_name?.length == 0 ||
        email.sender_email?.length == 0 ||
        email.email_body?.length == 0
      ) {
        setIsPublishValid(false);
      }
    });
  };

  useEffect(() => {
    emailData.map((email) => {
      const isPublishValid = validatePublish(email);
      setIsPublishValid(isPublishValid);
    });
    const isValid = validate();
    setIsValid(isValid);
  }, [
    campaignTitle,
    recipientLists,
    recipientTags,
    emailData[selectedEmailIndex]?.email_subject,
    emailData[selectedEmailIndex]?.email_preview_text,
    emailData[selectedEmailIndex]?.sender_name,
    emailData[selectedEmailIndex]?.sender_email,
    emailData[selectedEmailIndex]?.email_body,
  ]);

  // function for adding new email in the sequence
  const addNextEmail = () => {
    if ("active" != campaignStatus && "archived" != campaignStatus) {
      setEmailData((prevEmailData) => {
        setSelectedEmailIndex(prevEmailData.length);
        setActiveEmailData(defaultEmailData);
        return [...prevEmailData, { ...defaultEmailData }];
      });
    }
  };

  // function for removing an email from the sequence
  const deleteEmail = (index, email_id) => {
    if (email_id) {
      setIsEmailDelete("block");
      setDeleteTitle("Delete Sequence Email");
      setDeleteMessage("Are you sure you want to delete the email?");
      setEmailIndex(index);
      setEmailID(email_id);
    } else {
      setEmailData((prevEmailData) => {
        const copy = [...prevEmailData];
        copy.splice(index, 1);
        setSelectedEmailIndex(
          index < copy.length ? index : Math.max(0, index - 1)
        );
        return copy;
      });
    }
  };

  const onDeleteShow = async (status) => {
    setIsEmailDelete(status);
  };

  const onNotPublish = async (status) => {
    setIsPublish(status);
  };

  const onPublishStatus = async (status) => {
    if (status) {
      const campaign = {
        title: campaignTitle,
        recipients: {
          lists: recipientLists?.map((list) => {
            return {
              id: list.id,
              title: list.title,
            };
          }),
          tags: recipientTags?.map((tag) => {
            return {
              id: tag.id,
              title: tag.title,
            };
          }),
        },
        type: emailData.length > 1 ? "sequence" : "regular",
        status: "active",
        emails: emailData.map((email) => {
          return {
            id: email?.id,
            email_subject: email.email_subject,
            email_preview_text: email.email_preview_text,
            sender_email: email.sender_email,
            delay_count: email.delay_count,
            delay_value: email.delay_value,
            sender_name: email.sender_name,
            // email_body: email.email_body,
            email_body: "Dummy Email Body",
            email_json: email.email_json,
          };
        }),
        campaign_id: id,
      };

      updateCampaignRequest(campaign).then((response) => {
        if (201 === response.code) {
          // Show success message
          setNotificationType("success");
          setShowNotification("block");
          setMessage(response?.message);
          toggleRefresh();
        } else {
          setNotificationType("warning");
          setShowNotification("block");
          setMessage(response?.message);
        }
      });
      setIsPublish("none");
      const isValid = validate();
      setIsValid(isValid);
      ClearNotification("none", setShowNotification);
    }
  };

  const onDeleteStatus = async (status) => {
    if (status) {
      setEmailData((prevEmailData) => {
        const copy = [...prevEmailData];
        copy.splice(emailIndex, 1);
        setSelectedEmailIndex(
          emailIndex < copy.length ? emailIndex : Math.max(0, emailIndex - 1)
        );
        return copy;
      });

      deleteCampaignEmail(id, emailID).then((response) => {
        if (200 === response.code) {
          setNotificationType("success");
          setShowNotification("block");
          setMessage(response.message);
          toggleRefresh();
        } else {
          setErrors({
            ...errors,
            title: response?.message,
          });
        }
      });
    }
    setIsEmailDelete("none");
  };

  // handler function for each text field change in each email sequence
  const handleEmailFieldsChange = (value, key) => {
    setIsValid(true);
    setActiveEmailData((prevState) => ({
      ...prevState,
      [key]: value,
    }));

    setEmailData((prevEmailData) => {
      const copy = [...prevEmailData];
      if (key === "subject" || key === "preview") {
        if (value.length > 200) return copy;
      }
      if (key == "sender_email") {
        validateSenderEmail(copy[selectedEmailIndex][key], value);
      }
      copy[selectedEmailIndex][key] = value;
      return copy;
    });
  };
  const openTemplate = () => {
    setIsTemplate(true);
    setIsClose(!isClose);
  };
  const showTemplate = () => {
    setShowTemplates(true);
  };

  const setEmailBody = (html) => {
    setEmailData((prevEmailData) => {
      const copy = [...prevEmailData];
      copy[selectedEmailIndex].body = html;
      return copy;
    });
  };

  const setActiveEmailSequence = (index) => {
    setSelectedEmailIndex(index);
    setActiveEmailData(emailData[index]);
  };

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

  const showDropDown = () => {
    setDropDown(!dropDown);
  };

  // Set email subject text custom tag/placeholder
  const handleSubjectPlaceholder = async (placeholder) => {
    const prevData = emailData[selectedEmailIndex]?.email_subject;
    const newData = prevData + " " + placeholder;

    setEmailData((prevEmailData) => {
      const copy = [...prevEmailData];
      if (newData.length > 200) {
        return copy;
      }
      copy[selectedEmailIndex]["email_subject"] = newData;
      return copy;
    });
    validatePublish();
  };

  // Set email preview text custom tag/placeholder
  const handlePreviewPlaceholder = async (placeholder) => {
    const prevData = emailData[selectedEmailIndex]?.email_preview_text;
    const newData = prevData + " " + placeholder;

    setEmailData((prevEmailData) => {
      const copy = [...prevEmailData];
      if (newData.length > 200) {
        return copy;
      }
      copy[selectedEmailIndex]["email_preview_text"] = newData;
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
                  <DoubleAngleLeftIcon />
                  Campaigns
                </Link>
              </div>
              <h2 className="campaign-title">Edit Campaign</h2>
            </div>
            <div className="right-section">
              {/* <button className="mrm-custom-select-btn">Month</button> */}
            </div>
          </div>
        </div>

        {showLoader ? (
          <LoadingIndicator type="table" />
        ) : (
          <div className="mintmrm-container">
            <div className="add-campaign-wrapper">
              <div className="add-email-section">
                {emailData.map((email, index) => {
                  return (
                    <div className="email-box" key={`emails-${index}`}>
                      <div
                        className={
                          selectedEmailIndex != index
                            ? "email-select-section"
                            : "email-select-section selected"
                        }
                        onClick={() => setActiveEmailSequence(index)}
                      >
                        <div className="email-icon-section">
                          <InboxIcon />
                        </div>
                        <h5>Email {index + 1}</h5>
                        {index > 0 && (
                          <div
                            className="delete-option"
                            onClick={() => deleteEmail(index, email.id)}
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
                          disabled={isReadonly}
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
                          {recipientLists?.length == 0 &&
                          recipientTags?.length == 0 ? (
                            <button
                              className="all-recipients"
                              onClick={showDropDown}
                              disabled={isReadonly}
                            >
                              All Subscriber
                              {dropDown ? <UpArrowIcon /> : <DownArrowIcon />}
                            </button>
                          ) : (
                            <button
                              className="all-recipients selected show"
                              onClick={showDropDown}
                              disabled={isReadonly}
                            >
                              <span className="tags">
                                {recipientTags?.length} Tags
                              </span>
                              <span className="from">and</span>
                              <span className="lists">
                                {recipientLists?.length} Lists.
                              </span>
                              <span className="recipients">
                                {recipientsCount} Recipients
                              </span>
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
                    <div className="email-delay input-item">
                      <label>Delay</label>
                      <div className="delay_count_input">
                        <div className="delay-input">
                          <input
                            type="number"
                            name="delay_count"
                            value={emailData[selectedEmailIndex]?.delay_count}
                            disabled={isReadonly}
                            onChange={(e) =>
                              handleEmailFieldsChange(
                                e.target.value,
                                "delay_count"
                              )
                            }
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
                          onChange={(e) =>
                            handleEmailFieldsChange(
                              e.target.value,
                              "delay_value"
                            )
                          }
                          name="delay_value"
                          value={emailData[selectedEmailIndex]?.delay_value}
                          disabled={isReadonly}
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
                  )}
                  <div className="email-subject input-item">
                    <label>Subject:</label>
                    <input
                      type="text"
                      name="subject"
                      value={emailData[selectedEmailIndex]?.email_subject}
                      onChange={(e) =>
                        handleEmailFieldsChange(e.target.value, "email_subject")
                      }
                      placeholder="Be Specific and concise to spark interest"
                      disabled={isReadonly}
                    />
                    <span>
                      {emailData[selectedEmailIndex]?.email_subject?.length}/200
                    </span>
                    <div
                      className="setting-section"
                      style={
                        isReadonly ? { display: "none" } : { display: "inline" }
                      }
                    >
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
                      name="email_preview_text"
                      value={emailData[selectedEmailIndex]?.email_preview_text}
                      onChange={(e) =>
                        handleEmailFieldsChange(
                          e.target.value,
                          "email_preview_text"
                        )
                      }
                      placeholder="Write a summary of your email to display after the subject line"
                      disabled={isReadonly}
                    />
                    <span>
                      {
                        emailData[selectedEmailIndex]?.email_preview_text
                          ?.length
                      }
                      /200
                    </span>
                    <div
                      className="setting-section"
                      style={
                        isReadonly ? { display: "none" } : { display: "inline" }
                      }
                    >
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
                    <div className="form-group sender-name">
                      <label>From</label>
                      <input
                        type="text"
                        name="senderName"
                        value={emailData[selectedEmailIndex]?.sender_name}
                        onChange={(e) =>
                          handleEmailFieldsChange(e.target.value, "sender_name")
                        }
                        placeholder="Enter Name"
                        disabled={isReadonly}
                      />
                    </div>

                    <div className="form-group email-input">
                      <input
                        type="email"
                        name="senderEmail"
                        value={emailData[selectedEmailIndex]?.sender_email}
                        onChange={(e) =>
                          handleEmailFieldsChange(
                            e.target.value,
                            "sender_email"
                          )
                        }
                        placeholder="Enter Email"
                        disabled={isReadonly}
                      />

                      <p className={ errors?.email ? "error-message show" : "error-message" } >
                        {errors?.email}
                      </p>
                    </div>
                  </div>

                  <div className="email-design input-item">
                    <label>Design</label>
                    <div className="add-template-section" >
                      <div className="add-template-area" onClick={openTemplate} >
                        <TemplateIcon />
                        <Link to="">Select a Template</Link>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="content-save-section">
                  {"active" == campaignStatus ? (
                    <button
                      className="campaign-save mintmrm-btn"
                      disabled={true}
                    >
                      Active
                    </button>
                  ) : "archived" == campaignStatus ? (
                    <button
                      className="campaign-save mintmrm-btn completed"
                      disabled={true}
                    >
                      Archived
                    </button>
                  ) : (
                    <>
                      {isPublishValid ? (
                        <button
                          className={
                            isPublishValid
                              ? "campaign-schedule mintmrm-btn outline"
                              : "campaign-schedule mintmrm-btn outline disable"
                          }
                          disabled={!isPublishValid}
                          onClick={publishCampaignNow}
                        >
                          Schedule
                        </button>
                      ) : (
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
                            onClick={publishCampaignNow}
                          >
                            Schedule
                          </button>
                        </ToolTip>
                      )}
                      <button
                        type="submit"
                        className="campaign-save mintmrm-btn"
                        onClick={() => updateCampaign("draft")}
                        disabled={!isValid}
                      >
                        Save draft
                      </button>
                    </>
                  )}

                  {/* {responseMessage && <p>{responseMessage}</p>} */}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="mintmrm-container" style={{ display: isPublish }}>
        <PublishAlert
          title="Campaign Publish"
          message="Are you sure to run this campaign? It can not be edited after launch."
          onNotPublish={onNotPublish}
          onPublishStatus={onPublishStatus}
          buttonText={"Publish"}
        />
      </div>
      <div className="mintmrm-container" style={{ display: isEmailDelete }}>
        <DeletePopup
          title={deleteTitle}
          message={deleteMessage}
          onDeleteShow={onDeleteShow}
          onDeleteStatus={onDeleteStatus}
        />
      </div>
      <SuccessfulNotification
        display={showNotification}
        setShowNotification={setShowNotification}
        notificationType={notificationType}
        setNotificationType={setNotificationType}
        message={message}
      />
      {!isClose && (
        <CampaignTemplates
          refresh={refresh}
          setRefresh={setRefresh}
          isOpen={isTemplate}
          isClose={isClose}
          setIsClose={setIsClose}
          isNewCampaign={false}
          selectedEmailIndex={selectedEmailIndex}
          emailData={emailData[selectedEmailIndex]}
          setEmailBody={setEmailBody}
          setIsTemplate={setIsTemplate}
          setIsReadonly={setIsReadonly}
          isReadonly={isReadonly}
          campaignData={{
            title: campaignTitle,
            recipients: {
              lists: recipientLists?.map((list) => {
                return {
                  id: list.id,
                  title: list.title,
                };
              }),
              tags: recipientTags?.map((tag) => {
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
                id: email.id,
                email_subject: email.email_subject,
                email_preview_text: email.email_preview_text,
                sender_email: email.sender_email,
                delay_count: email.delay_count,
                delay_value: email.delay_value,
                sender_name: email.sender_name,
                email_body: email.email_body,
                email_json: email.email_json,
              };
            }),
          }}
        />
      )}
    </>
  );
}
