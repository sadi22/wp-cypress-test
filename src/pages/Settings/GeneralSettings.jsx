import _ from "lodash";
import React, { useEffect, useRef, useState } from "react";
import AddItemDropdown from "../../components/AddItemDropdown";
import CrossIcon from "../../components/Icons/CrossIcon";
import GeneralSettingIcon from "../../components/Icons/GeneralSettingIcon";
import TooltipQuestionIcon from "../../components/Icons/TooltipQuestionIcon";
import ListenForOutsideClicks, {
  useOutsideAlerter,
} from "../../components/ListenForOutsideClicks";
import SuccessfulNotification from "../../components/SuccessfulNotification";
import { getLists } from "../../services/List";
import {
  getGeneralSettings, getOptinSettings,
  submitGeneralSetting,
} from "../../services/Setting";
import { getTags } from "../../services/Tag";
import { AdminNavMenuClassChange } from "../../utils/admin-settings";
import SettingsNav from "./SettingsNav";
import LoadingIndicator from "../../components/LoadingIndicator";

export default function GeneralSettings() {
  // Admin active menu selection
  AdminNavMenuClassChange("mrm-admin", "settings");
  _.noConflict();
  const [loader, setLoader] = useState(false);
  const [notificationType, setNotificationType] = useState("success");
  const [showNotification, setShowNotification] = useState("none");
  const [message, setMessage] = useState("");
  const [selectUnsubscribeOption, setSelectUnsubscribeOption] =
    useState("message");
  const [selectPreferenceOption, setSelectPreferenceOption] =
    useState("no-contact-manage");
  const [userSelectSwitch, setUserSelectSwitch] = useState(false);
  const [commentSelectSwitch, setCommentSelectSwitch] = useState(false);

  const [lists, setLists] = useState([]);
  const [commentLists, setCommentLists] = useState([]);
  const [tags, setTags] = useState([]);
  const [isActiveTag, setIsActiveTag] = useState(false);
  const [assignTags, setAssignTags] = useState([]);
  const [administratorLists, setAdministratorLists] = useState([]);
  const [editorLists, setEditorLists] = useState([]);
  const [authorLists, setAuthorLists] = useState([]);
  const [contributorLists, setContributorLists] = useState([]);
  const [subscriberLists, setSubscriberLists] = useState([]);
  const [isActiveList, setIsActiveList] = useState(false);
  const [isActiveCommentList, setIsActiveCommentList] = useState(false);
  const [isActiveAdministratorList, setIsActiveAdministratorList] =
    useState(false);
  const [isActiveEditorList, setIsActiveEditorList] = useState(false);
  const [isActiveAuthorList, setIsActiveAuthorList] = useState(false);
  const [isActiveContributorList, setIsActiveContributorList] = useState(false);
  const [isActiveSubscriberList, setIsActiveSubscriberList] = useState(false);
  const [assignLists, setAssignLists] = useState([]);
  const [assignCommentLists, setAssignCommentLists] = useState([]);
  const [assignAdministratorLists, setAssignAdministratorLists] = useState([]);
  const [assignEditorLists, setAssignEditorLists] = useState([]);
  const [assignAuthorLists, setAssignAuthorLists] = useState([]);
  const [assignContributorLists, setAssignContributorLists] = useState([]);
  const [assignSubscriberLists, setAssignSubscriberLists] = useState([]);
  const [refresh, setRefresh] = useState();
  const listMenuRef = useRef(null);
  const listCommentMenuRef = useRef(null);
  const listAdministratorMenuRef = useRef(null);
  const listEditorMenuRef = useRef(null);
  const listAuthorMenuRef = useRef(null);
  const listContributorMenuRef = useRef(null);
  const listSubscriberMenuRef = useRef(null);
  const tagMenuRef = useRef(null);
  const [redirectUrl, setRedirectUrl] = useState("");
  const [editableFirstname, setEditableFirstname] = useState(false);
  const [editableLastname, setEditableLastname] = useState(false);
  const [editableStatus, setEditableStatus] = useState(false);
  const [editabList, setEditableList] = useState(false);

  const [listening, setListening] = useState(false);
  // Get General setting data
  const [confirmation_message, setConfirmation_message] = useState("");
  const [errors, setErrors] = useState({});
  const [isValidate, setIsValidate] = useState(true);
  const [showLoader, setShowLoader] = useState(true);
  const validate = (name, value) => {
    switch (name) {
      case "redirect":
        if (
            !new RegExp(
                "(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?"
            ).test(value)
        ) {
          setErrors({
            ...errors,
            redirect: "Enter a valid URL",
          });
          setIsValidate(false);
        } else {
          setErrors({});
          setIsValidate(true);
        }
        break;
      default:
        break;
    }
  };

  useEffect(() => {
  let tinyMceConfig = {
    tinymce: {
      wpautop: true,
      plugins:
          "charmap colorpicker compat3x directionality hr image lists media tabfocus textcolor wordpress wpautoresize wpdialogs wpeditimage wpemoji wpgallery wplink wptextpattern wpview",
      toolbar1:
          "bold italic underline strikethrough | bullist numlist | blockquote hr wp_more | alignleft aligncenter alignright | link unlink | wp_adv ",
      toolbar2:
          "formatselect alignjustify forecolor | fontsizeselect | fontselect |pastetext removeformat charmap | outdent indent | undo redo | wp_help ",
    },
    quicktags: true,
    mediaButtons: true,
  };

  let editorId = "confirmation-message";
  wp.editor.remove(editorId);
  wp.editor.initialize(editorId, tinyMceConfig);
})

  useEffect(() => {
    setShowLoader(true);
    getGeneralSettings().then((response) => {
      if(response.success){
        setShowLoader(false);
        const unsubscriber_settings = response.unsubscriber_settings;
        const preference_settings = response.preference;
        const comment_form_subscription = response.comment_form_subscription;
        const user_signup = response.user_signup;
        if (Object.keys(unsubscriber_settings).length > 0) {
          setRedirectUrl(unsubscriber_settings.url);
          setSelectUnsubscribeOption(
              unsubscriber_settings.confirmation_type
                  ? unsubscriber_settings.confirmation_type
                  : "message"
          );
          setConfirmation_message(unsubscriber_settings.confirmation_message);
          tinymce
              .get("confirmation-message")
              .setContent(unsubscriber_settings.confirmation_message);
        }

        //preference
        if (Object.keys(preference_settings).length > 0) {
          setSelectPreferenceOption(
              preference_settings.preference
                  ? preference_settings.preference
                  : "no-contact-manage"
          );
          setEditableFirstname(
              preference_settings.primary_fields
                  ? preference_settings.primary_fields.first_name
                  : false
          );
          setEditableLastname(
              preference_settings.primary_fields
                  ? preference_settings.primary_fields.last_name
                  : false
          );
          setEditableStatus(
              preference_settings.primary_fields
                  ? preference_settings.primary_fields.status
                  : false
          );
          setEditableList(
              preference_settings.primary_fields
                  ? preference_settings.primary_fields.list
                  : false
          );
          setAssignLists(preference_settings.lists);
        }
        if (Object.keys(comment_form_subscription).length > 0) {
          setCommentSelectSwitch(comment_form_subscription.enable);
          setAssignCommentLists(comment_form_subscription.lists);
          setAssignTags(comment_form_subscription.tags);
        }
        if (Object.keys(user_signup).length > 0) {
          setUserSelectSwitch(user_signup.enable);
         if (user_signup.list_mapping.length > 0) {
          user_signup.list_mapping.map(function (value, index) {
            if (value.role == "administrator") {
              setAssignAdministratorLists(value.list);
            }
            if (value.role == "editor") {
              setAssignEditorLists(value.list);
            }
            if (value.role == "author") {
              setAssignAuthorLists(value.list);
            }
            if (value.role == "contributor") {
              setAssignContributorLists(value.list);
            }
            if (value.role == "subscriber") {
              setAssignSubscriberLists(value.list);
            }
          });
        }


        }
      }

    });
  }, []);


  useEffect(() => {
    getGeneralSettings().then((response) => {
      if (Object.keys(response.unsubscriber_settings).length > 0) {
        tinymce
            .get("confirmation-message")
            .setContent(response.unsubscriber_settings.confirmation_message);
      }
    });

  }, [selectUnsubscribeOption]);

  //Handle Submit general setting
  const handleGeneralSubmit = () => {
    setLoader(true);
    let message_content = "";

    if (selectUnsubscribeOption == 'message') {
      message_content = tinymce.get("confirmation-message").getContent();
    } else {
      message_content = confirmation_message;
    }
    const settings = {
      unsubscriber_settings: {
        confirmation_type: selectUnsubscribeOption,
        url: redirectUrl,
        confirmation_message: message_content,
      },
      preference: {
        enable: true,
        preference: selectPreferenceOption,
        lists: assignLists,
        primary_fields: {
          first_name: editableFirstname,
          last_name: editableLastname,
          status: editableStatus,
          list: editabList,
        },
      },
      comment_form_subscription: {
        enable: commentSelectSwitch,
        lists: assignCommentLists,
        tags: assignTags,
      },
      user_signup: {
        enable: userSelectSwitch,
        list_mapping: [
          {
            role: "administrator",
            list: assignAdministratorLists,
          },
          {
            role: "editor",
            list: assignEditorLists,
          },
          {
            role: "author",
            list: assignAuthorLists,
          },
          {
            role: "contributor",
            list: assignContributorLists,
          },
          {
            role: "subscriber",
            list: assignSubscriberLists,
          },
        ],
      },
    };
    submitGeneralSetting(settings).then((response) => {
      if (true === response.success) {
        setNotificationType("success");
        setShowNotification("block");
        setMessage(response?.message);
        setLoader(false);
      } else {
        setNotificationType("warning");
        setShowNotification("block");
        setMessage(response?.message);
        setLoader(false);
      }
    });
  };

  //Handle Confirmation message
  const handleChange = (event) => {
    const { name, value } = event.target;
    setConfirmation_message(value);
  };
  //Handle Confirmation Url
  const handleChangeURL = (event) => {
    const { name, value } = event.target;
    validate(name, value);
    setRedirectUrl(value);
  };

  // Handle Primary edit Field
  const handleEditPrimaryFields = (event) => {
    const { name, value, checked } = event.target;
    if ("first-name" == name) {
      setEditableFirstname(checked);
    }
    if ("last-name" == name) {
      setEditableLastname(checked);
    }
    if ("status" == name) {
      setEditableStatus(checked);
    }
    if ("lists" == name) {
      setEditableList(checked);
    }
  };

  // Fetch lists
  useEffect(() => {
    // Get lists
    getLists().then((results) => {
      results.data.map(function () {
        setLists(results.data);
        setAdministratorLists(results.data);
        setEditorLists(results.data);
        setAuthorLists(results.data);
        setContributorLists(results.data);
        setSubscriberLists(results.data);
        setCommentLists(results.data);
      });
    });
    // Get tags
    getTags().then((results) => {
      setTags(results.data);
    });
  }, [refresh]);

  // Outside click events for preference page List checkbox dropdown
  useOutsideAlerter(listMenuRef, setIsActiveList);
  useEffect(
    ListenForOutsideClicks(listening, setListening, tagMenuRef, setIsActiveTag)
  );
  useEffect(
    ListenForOutsideClicks(
      listening,
      setListening,
      listAdministratorMenuRef,
      setIsActiveAdministratorList
    )
  );
  useEffect(
    ListenForOutsideClicks(
      listening,
      setListening,
      listEditorMenuRef,
      setIsActiveEditorList
    )
  );
  useEffect(
    ListenForOutsideClicks(
      listening,
      setListening,
      listAuthorMenuRef,
      setIsActiveAuthorList
    )
  );
  useEffect(
    ListenForOutsideClicks(
      listening,
      setListening,
      listContributorMenuRef,
      setIsActiveContributorList
    )
  );
  useEffect(
    ListenForOutsideClicks(
      listening,
      setListening,
      listSubscriberMenuRef,
      setIsActiveSubscriberList
    )
  );
  useEffect(
    ListenForOutsideClicks(listening, setListening, tagMenuRef, setIsActiveTag)
  );
  useEffect(
    ListenForOutsideClicks(
      listening,
      setListening,
      listCommentMenuRef,
      setIsActiveCommentList
    )
  );
  const handleList = () => {
    setIsActiveList(!isActiveList);
  };
  const handleTag = () => {
    setIsActiveTag(!isActiveTag);
  };
  const handleAdministratorList = () => {
    setIsActiveAdministratorList(!isActiveAdministratorList);
  };
  const handleEditorList = () => {
    setIsActiveEditorList(!isActiveEditorList);
  };
  const handleAuthorList = () => {
    setIsActiveAuthorList(!isActiveAuthorList);
  };
  const handleContributorList = () => {
    setIsActiveContributorList(!isActiveContributorList);
  };
  const handleSubscriberList = () => {
    setIsActiveSubscriberList(!isActiveSubscriberList);
  };
  const handleCommentList = () => {
    setIsActiveCommentList(!isActiveCommentList);
  };
  const deleteSelectedList = (e, id) => {
    const index = assignLists.findIndex((item) => item.id == id);

    // already in selected list so remove it from the array
    if (0 <= index) {
      setAssignLists(assignLists.filter((item) => item.id != id));
    }
  };
  const deleteSelectedAdministratorList = (e, id) => {
    const index = assignAdministratorLists.findIndex((item) => item.id == id);

    // already in selected list so remove it from the array
    if (0 <= index) {
      setAssignAdministratorLists(
        assignAdministratorLists.filter((item) => item.id != id)
      );
    }
  };
  const deleteSelectedEditorList = (e, id) => {
    const index = assignEditorLists.findIndex((item) => item.id == id);

    // already in selected list so remove it from the array
    if (0 <= index) {
      setAssignEditorLists(assignEditorLists.filter((item) => item.id != id));
    }
  };
  const deleteSelectedAuthorList = (e, id) => {
    const index = assignAuthorLists.findIndex((item) => item.id == id);

    // already in selected list so remove it from the array
    if (0 <= index) {
      setAssignAuthorLists(assignAuthorLists.filter((item) => item.id != id));
    }
  };
  const deleteSelectedContributorList = (e, id) => {
    const index = assignContributorLists.findIndex((item) => item.id == id);

    // already in selected list so remove it from the array
    if (0 <= index) {
      setAssignContributorLists(
        assignContributorLists.filter((item) => item.id != id)
      );
    }
  };
  const deleteSelectedSubscriberList = (e, id) => {
    const index = assignSubscriberLists.findIndex((item) => item.id == id);

    // already in selected list so remove it from the array
    if (0 <= index) {
      setAssignSubscriberLists(
        assignSubscriberLists.filter((item) => item.id != id)
      );
    }
  };
  const deleteSelectedCommentList = (e, id) => {
    const index = assignCommentLists.findIndex((item) => item.id == id);

    // already in selected list so remove it from the array
    if (0 <= index) {
      setAssignCommentLists(assignCommentLists.filter((item) => item.id != id));
    }
  };
  const deleteSelectedTag = (e, id) => {
    const index = assignTags.findIndex((item) => item.id == id);

    // already in selected list so remove it from the array
    if (0 <= index) {
      setAssignTags(assignTags.filter((item) => item.id != id));
    }
  };
  const onChangeUnsubscribeValue = (e) => {
    setSelectUnsubscribeOption(e.target.value);
  };
  const onChangePreferenceValue = (e) => {
    setSelectPreferenceOption(e.target.value);
  };

  const handleUserSwitcher = () => {
    setUserSelectSwitch(!userSelectSwitch);
  };

  const handleCommentSwitcher = () => {
    setCommentSelectSwitch(!commentSelectSwitch);
  };
  return (
    <div className="mintmrm-settings-page">
      <div className="mintmrm-container">
        <div className="mintmrm-settings">
          <h2 class="conatct-heading">Settings</h2>

          <div className="mintmrm-settings-wrapper">
            <SettingsNav />

            <div className="settings-tab-content">
              {showLoader ? (
                  <LoadingIndicator type="table" />
              ) : (
              <div className="single-tab-content general-tab-content">
                <div className="tab-body">
                  <header className="tab-header">
                    <h4 className="title">
                      <GeneralSettingIcon />
                      General Settings
                    </h4>
                  </header>

                  <div className="form-wrapper">
                    <div className="general-single-settings">
                      <div className="general-settings-header">
                        <div className="form-group">
                          <label htmlFor="">
                            Unsubscribe Page Settings
                            <span class="mintmrm-tooltip">
                              <TooltipQuestionIcon />
                              <p>
                                Define behaviour of the form after submission
                              </p>
                            </span>
                          </label>
                        </div>
                      </div>
                      <div className="general-settings-body show">
                        <div className="form-group top-align">
                          <label htmlFor="confirmation-type">
                            After Confirmation Type
                            <span class="mintmrm-tooltip">
                              <TooltipQuestionIcon />
                              <p>
                                Define behaviour of the form after submission
                              </p>
                            </span>
                          </label>

                          <div className="input-custom-wrapper">
                            <span className="mintmrm-radiobtn">
                              <input
                                id="show-message"
                                type="radio"
                                name="message-redirect"
                                value="message"
                                checked={selectUnsubscribeOption === "message"}
                                onChange={onChangeUnsubscribeValue}
                              />
                              <label for="show-message">Show Message</label>
                            </span>
                            <span className="mintmrm-radiobtn">
                              <input
                                id="redirect-url"
                                type="radio"
                                name="message-redirect"
                                value="redirect"
                                checked={selectUnsubscribeOption === "redirect"}
                                onChange={onChangeUnsubscribeValue}
                              />
                              <label for="redirect-url">
                                Redirect to an URL
                              </label>
                            </span>
                          </div>
                        </div>

                        {selectUnsubscribeOption === "message" ? (
                          <div className="form-group top-align has-wysiwyg-editor">
                            <label htmlFor="confirmation-message">
                              Confirmation Message
                              <span class="mintmrm-tooltip">
                                <TooltipQuestionIcon />
                                <p>
                                  Define behaviour of the form after submission
                                </p>
                              </span>
                            </label>

                            <div className="input-custom-wrapper">
                              <textarea
                                id="confirmation-message"
                                rows="3"
                                placeholder="Enter Confirmation Message"
                                name="confirmation_message"
                                // value={confirmation_message}
                                onChange={handleChange}
                              ></textarea>
                            </div>
                          </div>
                        ) : (
                          <div className="form-group">
                            <label htmlFor="redirect-url">
                              Redirect URL
                              <span class="mintmrm-tooltip">
                                <TooltipQuestionIcon />
                                <p>
                                  Define behaviour of the form after submission
                                </p>
                              </span>
                            </label>

                            <input
                              type="text"
                              name="redirect"
                              placeholder="Enter Redirect URL"
                              value={redirectUrl}
                              onChange={handleChangeURL}
                            />
                            <p
                                className={
                                  errors?.redirect
                                      ? "error-message show"
                                      : "error-message"
                                }
                            >

                            {errors?.redirect}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="general-single-settings">
                      <div className="general-settings-header">
                        <div className="form-group">
                          <label htmlFor="">
                            Preference Page Select
                            <span class="mintmrm-tooltip">
                              <TooltipQuestionIcon />
                              <p>
                                Define behaviour of the form after submission
                              </p>
                            </span>
                          </label>
                        </div>
                      </div>

                      <div className="general-settings-body show">
                        <div className="form-group top-align">
                          <label htmlFor="">
                            Select Preference
                            <span class="mintmrm-tooltip">
                              <TooltipQuestionIcon />
                              <p>
                                Define behaviour of the form after submission
                              </p>
                            </span>
                          </label>
                          <div className="select-preference-wrapper">
                            <span className="mintmrm-radiobtn">
                              <input
                                id="no-contact-manage"
                                type="radio"
                                name="select-reference-option"
                                value="no-contact-manage"
                                checked={
                                  selectPreferenceOption === "no-contact-manage"
                                }
                                onChange={onChangePreferenceValue}
                              />
                              <label for="no-contact-manage">
                                No, Contact can not manage list subscriptions
                              </label>
                            </span>
                            <span className="mintmrm-radiobtn">
                              <input
                                id="contact-manage-following"
                                type="radio"
                                name="select-reference-option"
                                value="contact-manage-following"
                                checked={
                                  selectPreferenceOption ===
                                  "contact-manage-following"
                                }
                                onChange={onChangePreferenceValue}
                              />
                              <label for="contact-manage-following">
                                Contact only see and manage the following list
                                subscriptions
                              </label>
                            </span>
                            <span className="mintmrm-radiobtn">
                              <input
                                id="contact-manage"
                                type="radio"
                                name="select-reference-option"
                                value="contact-manage"
                                checked={
                                  selectPreferenceOption === "contact-manage"
                                }
                                onChange={onChangePreferenceValue}
                              />
                              <label for="contact-manage">
                                Contact can see all lists and manage
                                subscriptions
                              </label>
                            </span>
                            {selectPreferenceOption ==
                            "contact-manage-following" ? (
                              <div
                                className="form-group list-section"
                                ref={listMenuRef}
                              >
                                <label>
                                  Lists
                                  <span class="mintmrm-tooltip">
                                    <TooltipQuestionIcon />
                                    <p>
                                      Define behaviour of the form after
                                      submission
                                    </p>
                                  </span>
                                </label>
                                <button
                                  type="button"
                                  className={
                                    isActiveList
                                      ? "drop-down-button show"
                                      : "drop-down-button"
                                  }
                                  onClick={handleList}
                                >
                                  {assignLists.length != 0
                                    ? assignLists?.map((list) => {
                                        return (
                                          <span
                                            className="single-list"
                                            key={list.id}
                                          >
                                            {list.title}

                                            <span
                                              className="close-list"
                                              title="Delete"
                                              onClick={(e) =>
                                                deleteSelectedList(e, list.id)
                                              }
                                            >
                                              <CrossIcon />
                                            </span>
                                          </span>
                                        );
                                      })
                                    : "Select Lists"}
                                </button>
                                <AddItemDropdown
                                  isActive={isActiveList}
                                  setIsActive={setIsActiveList}
                                  selected={assignLists}
                                  setSelected={setAssignLists}
                                  endpoint="lists"
                                  items={lists}
                                  allowMultiple={true}
                                  allowNewCreate={true}
                                  name="list"
                                  title="CHOOSE LIST"
                                  refresh={refresh}
                                  setRefresh={setRefresh}
                                  prefix="lists"
                                />
                              </div>
                            ) : null}
                          </div>
                        </div>
                        <hr />
                        <div className="form-group top-align">
                          <label htmlFor="">
                            Editable Primary Fields
                            <span class="mintmrm-tooltip">
                              <TooltipQuestionIcon />
                              <p>
                                Define behaviour of the form after submission
                              </p>
                            </span>
                          </label>
                          <div className="editable-primary-field">
                            <span className="mintmrm-checkbox">
                              <input
                                id="first-name"
                                type="checkbox"
                                name="first-name"
                                checked={editableFirstname}
                                onChange={handleEditPrimaryFields}
                              />
                              <label for="first-name">First name</label>
                            </span>
                            <span className="mintmrm-checkbox">
                              <input
                                id="last-name"
                                type="checkbox"
                                name="last-name"
                                checked={editableLastname}
                                onChange={handleEditPrimaryFields}
                              />
                              <label for="last-name">Last name</label>
                            </span>
                            <span className="mintmrm-checkbox">
                              <input
                                id="status"
                                type="checkbox"
                                name="status"
                                checked={editableStatus}
                                onChange={handleEditPrimaryFields}
                              />
                              <label for="status">Status</label>
                            </span>
                            <span className="mintmrm-checkbox">
                              <input
                                id="lists"
                                type="checkbox"
                                name="lists"
                                checked={editabList}
                                onChange={handleEditPrimaryFields}
                              />
                              <label for="lists">Lists</label>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="general-single-settings">
                      <div className="general-settings-header">
                        <div className="form-group">
                          <label htmlFor="">
                            User Signup Settings
                            <span class="mintmrm-tooltip">
                              <TooltipQuestionIcon />
                              <p>
                                Define behaviour of the form after submission
                              </p>
                            </span>
                          </label>
                          <span className="mintmrm-switcher">
                            <input
                              type="checkbox"
                              name="user-signup-radio"
                              id="user-signup-radio"
                              value={userSelectSwitch}
                              onChange={handleUserSwitcher}
                              checked={userSelectSwitch}
                            />
                            <label htmlFor="user-signup-radio"></label>
                          </span>
                        </div>
                      </div>

                      <div
                        className={
                          userSelectSwitch
                            ? "general-settings-body user-signup-settings show"
                            : "general-settings-body user-signup-settings"
                        }
                      >
                        <div className="wp-user">
                          <span>WP User Role</span>
                          <span>Lists to be added</span>
                        </div>
                        <div
                          className="form-group"
                          ref={listAdministratorMenuRef}
                        >
                          <label htmlFor="">Administrator</label>
                          <div className="administrator input-custom-wrapper">
                            <button
                              type="button"
                              className={
                                isActiveAdministratorList
                                  ? "drop-down-button show"
                                  : "drop-down-button"
                              }
                              onClick={handleAdministratorList}
                            >
                              {assignAdministratorLists.length != 0
                                ? assignAdministratorLists?.map((list) => {
                                    return (
                                      <span
                                        className="single-list"
                                        key={list.id}
                                      >
                                        {list.title}

                                        <span
                                          className="close-list"
                                          title="Delete"
                                          onClick={(e) =>
                                            deleteSelectedAdministratorList(
                                              e,
                                              list.id
                                            )
                                          }
                                        >
                                          <CrossIcon />
                                        </span>
                                      </span>
                                    );
                                  })
                                : "Select Lists"}
                            </button>
                            <AddItemDropdown
                              isActive={isActiveAdministratorList}
                              setIsActive={setIsActiveAdministratorList}
                              selected={assignAdministratorLists}
                              setSelected={setAssignAdministratorLists}
                              endpoint="lists"
                              items={administratorLists}
                              allowMultiple={true}
                              allowNewCreate={true}
                              name="list"
                              title="CHOOSE LIST"
                              refresh={refresh}
                              setRefresh={setRefresh}
                              prefix="administrator"
                            />
                          </div>
                        </div>

                        <div className="form-group" ref={listEditorMenuRef}>
                          <label htmlFor="">Editor</label>
                          <div className="editor input-custom-wrapper">
                            <button
                              type="button"
                              className={
                                isActiveEditorList
                                  ? "drop-down-button show"
                                  : "drop-down-button"
                              }
                              onClick={handleEditorList}
                            >
                              {assignEditorLists.length != 0
                                ? assignEditorLists?.map((list) => {
                                    return (
                                      <span
                                        className="single-list"
                                        key={list.id}
                                      >
                                        {list.title}

                                        <span
                                          className="close-list"
                                          title="Delete"
                                          onClick={(e) =>
                                            deleteSelectedEditorList(e, list.id)
                                          }
                                        >
                                          <CrossIcon />
                                        </span>
                                      </span>
                                    );
                                  })
                                : "Select Lists"}
                            </button>
                            <AddItemDropdown
                              isActive={isActiveEditorList}
                              setIsActive={setIsActiveEditorList}
                              selected={assignEditorLists}
                              setSelected={setAssignEditorLists}
                              endpoint="lists"
                              items={editorLists}
                              allowMultiple={true}
                              allowNewCreate={true}
                              name="list"
                              title="CHOOSE LIST"
                              refresh={refresh}
                              setRefresh={setRefresh}
                              prefix="editor"
                            />
                          </div>
                        </div>

                        <div className="form-group" ref={listAuthorMenuRef}>
                          <label htmlFor="">Author</label>
                          <div className="author input-custom-wrapper">
                            <button
                              type="button"
                              className={
                                isActiveAuthorList
                                  ? "drop-down-button show"
                                  : "drop-down-button"
                              }
                              onClick={handleAuthorList}
                            >
                              {assignAuthorLists.length != 0
                                ? assignAuthorLists?.map((list) => {
                                    return (
                                      <span
                                        className="single-list"
                                        key={list.id}
                                      >
                                        {list.title}

                                        <span
                                          className="close-list"
                                          title="Delete"
                                          onClick={(e) =>
                                            deleteSelectedAuthorList(e, list.id)
                                          }
                                        >
                                          <CrossIcon />
                                        </span>
                                      </span>
                                    );
                                  })
                                : "Select Lists"}
                            </button>
                            <AddItemDropdown
                              isActive={isActiveAuthorList}
                              setIsActive={setIsActiveAuthorList}
                              selected={assignAuthorLists}
                              setSelected={setAssignAuthorLists}
                              endpoint="lists"
                              items={authorLists}
                              allowMultiple={true}
                              allowNewCreate={true}
                              name="list"
                              title="CHOOSE LIST"
                              refresh={refresh}
                              setRefresh={setRefresh}
                              prefix="author"
                            />
                          </div>
                        </div>

                        <div
                          className="form-group"
                          ref={listContributorMenuRef}
                        >
                          <label htmlFor="">Contributor</label>
                          <div className="contributor input-custom-wrapper">
                            <button
                              type="button"
                              className={
                                isActiveContributorList
                                  ? "drop-down-button show"
                                  : "drop-down-button"
                              }
                              onClick={handleContributorList}
                            >
                              {assignContributorLists.length != 0
                                ? assignContributorLists?.map((list) => {
                                    return (
                                      <span
                                        className="single-list"
                                        key={list.id}
                                      >
                                        {list.title}

                                        <span
                                          className="close-list"
                                          title="Delete"
                                          onClick={(e) =>
                                            deleteSelectedContributorList(
                                              e,
                                              list.id
                                            )
                                          }
                                        >
                                          <CrossIcon />
                                        </span>
                                      </span>
                                    );
                                  })
                                : "Select Lists"}
                            </button>
                            <AddItemDropdown
                              isActive={isActiveContributorList}
                              setIsActive={setIsActiveContributorList}
                              selected={assignContributorLists}
                              setSelected={setAssignContributorLists}
                              endpoint="lists"
                              items={contributorLists}
                              allowMultiple={true}
                              allowNewCreate={true}
                              name="list"
                              title="CHOOSE LIST"
                              refresh={refresh}
                              setRefresh={setRefresh}
                              prefix="contributor"
                            />
                          </div>
                        </div>

                        <div className="form-group" ref={listSubscriberMenuRef}>
                          <label htmlFor="">Subscriber</label>
                          <div className="subscriber input-custom-wrapper">
                            <button
                              type="button"
                              className={
                                isActiveSubscriberList
                                  ? "drop-down-button show"
                                  : "drop-down-button"
                              }
                              onClick={handleSubscriberList}
                            >
                              {assignSubscriberLists.length != 0
                                ? assignSubscriberLists?.map((list) => {
                                    return (
                                      <span
                                        className="single-list"
                                        key={list.id}
                                      >
                                        {list.title}

                                        <span
                                          className="close-list"
                                          title="Delete"
                                          onClick={(e) =>
                                            deleteSelectedSubscriberList(
                                              e,
                                              list.id
                                            )
                                          }
                                        >
                                          <CrossIcon />
                                        </span>
                                      </span>
                                    );
                                  })
                                : "Select Lists"}
                            </button>
                            <AddItemDropdown
                              isActive={isActiveSubscriberList}
                              setIsActive={setIsActiveSubscriberList}
                              selected={assignSubscriberLists}
                              setSelected={setAssignSubscriberLists}
                              endpoint="lists"
                              items={subscriberLists}
                              allowMultiple={true}
                              allowNewCreate={true}
                              name="list"
                              title="CHOOSE LIST"
                              refresh={refresh}
                              setRefresh={setRefresh}
                              prefix="subscriber"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="general-single-settings">
                      <div className="general-settings-header">
                        <div className="form-group">
                          <label htmlFor="">
                            Comment Form Subscription Settings
                            <span class="mintmrm-tooltip">
                              <TooltipQuestionIcon />
                              <p>
                                Define behaviour of the form after submission
                              </p>
                            </span>
                          </label>
                          <span className="mintmrm-switcher">
                            <input
                              type="checkbox"
                              name="comment-radio"
                              id="comment-radio"
                              value={commentSelectSwitch}
                              onChange={handleCommentSwitcher}
                              checked={commentSelectSwitch}
                            />
                            <label htmlFor="comment-radio"></label>
                          </span>
                        </div>
                      </div>
                      <div
                        className={
                          commentSelectSwitch
                            ? "general-settings-body show"
                            : "general-settings-body"
                        }
                      >
                        <div className="form-group label-block" ref={listCommentMenuRef}>
                          <label>
                            Assign List
                            <span class="mintmrm-tooltip">
                              <TooltipQuestionIcon />
                              <p>
                                Define behaviour of the form after submission
                              </p>
                            </span>
                          </label>
                          <button
                            type="button"
                            className={
                              isActiveCommentList
                                ? "drop-down-button show"
                                : "drop-down-button"
                            }
                            onClick={handleCommentList}
                          >
                            {assignCommentLists.length != 0
                              ? assignCommentLists?.map((list) => {
                                  return (
                                    <span className="single-list" key={list.id}>
                                      {list.title}

                                      <span
                                        className="close-list"
                                        title="Delete"
                                        onClick={(e) =>
                                          deleteSelectedCommentList(e, list.id)
                                        }
                                      >
                                        <CrossIcon />
                                      </span>
                                    </span>
                                  );
                                })
                              : "Select Lists"}
                          </button>
                          <AddItemDropdown
                            isActive={isActiveCommentList}
                            setIsActive={setIsActiveCommentList}
                            selected={assignCommentLists}
                            setSelected={setAssignCommentLists}
                            endpoint="lists"
                            items={commentLists}
                            allowMultiple={true}
                            allowNewCreate={true}
                            name="list"
                            title="CHOOSE LIST"
                            refresh={refresh}
                            setRefresh={setRefresh}
                            prefix="comment"
                          />
                        </div>

                        <div className="form-group label-block" ref={tagMenuRef}>
                          <label>
                            Assign Tag
                            <span class="mintmrm-tooltip">
                              <TooltipQuestionIcon />
                              <p>
                                Define behaviour of the form after submission
                              </p>
                            </span>
                          </label>
                          <button
                            type="button"
                            className={
                              isActiveTag
                                ? "drop-down-button show"
                                : "drop-down-button"
                            }
                            onClick={handleTag}
                          >
                            {assignTags.length != 0
                              ? assignTags?.map((tag) => {
                                  return (
                                    <span className="single-list" key={tag.id}>
                                      {tag.title}

                                      <span
                                        className="close-list"
                                        title="Delete"
                                        onClick={(e) =>
                                          deleteSelectedTag(e, tag.id)
                                        }
                                      >
                                        <CrossIcon />
                                      </span>
                                    </span>
                                  );
                                })
                              : "Select Tags"}
                          </button>
                          <AddItemDropdown
                            isActive={isActiveTag}
                            setIsActive={setIsActiveTag}
                            selected={assignTags}
                            setSelected={setAssignTags}
                            endpoint="tags"
                            items={tags}
                            allowMultiple={true}
                            allowNewCreate={true}
                            name="tag"
                            title="CHOOSE TAG"
                            refresh={refresh}
                            setRefresh={setRefresh}
                            prefix="comment"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="tab-footer">
                  <button
                    className="mintmrm-btn"
                    type="button"
                    onClick={handleGeneralSubmit}
                    disabled={loader ? true : false}
                  >
                    Save Settings
                    {loader && <span className="mintmrm-loader"></span>}
                  </button>
                </div>
              </div>
              )}
            </div>
            {/* end settings-tab-content */}
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
    </div>
  );
}
