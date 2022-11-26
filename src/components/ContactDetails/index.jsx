import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Link,
  matchPath,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useGlobalStore } from "../../hooks/useGlobalStore";
import { deleteSingleContact } from "../../services/Contact";
import { getCustomFields } from "../../services/CustomField";
import { getLists } from "../../services/List";
import { getTags } from "../../services/Tag";
import { ClearNotification } from "../../utils/admin-notification";
import { AdminNavMenuClassChange, DateTime } from "../../utils/admin-settings";
import DeletePopup from "../DeletePopup";
import EmailDrawer from "../EmailDrawer";
import CreateNoteIcon from "../Icons/CreateNoteIcon";
import CrossIcon from "../Icons/CrossIcon";
import DoubleAngleLeftIcon from "../Icons/DoubleAngleLeftIcon";
import EditButton from "../Icons/EditButton";
import EmailIcon from "../Icons/EmailIcon";
import NoActivityIcon from "../Icons/NoActivityIcon";
import PlusIconSmall from "../Icons/PlusIconSmall";
import Search from "../Icons/Search";
import ThreeDotIcon from "../Icons/ThreeDotIcon";

import InputDate from "../InputDate";
import InputItem from "../InputItem/index";
import InputNumber from "../InputNumber";
import InoutPhone from "../InputPhone";
import InputTextArea from "../InputTextArea";
import InputSelect from "../InputSelect";
import InputRadio from "../InputRadio";
import InputCheckbox from "../InputCheckbox";

import ListenForOutsideClicks from "../ListenForOutsideClicks";
import LoadingIndicator from "../LoadingIndicator";
import NoteDrawer from "../NoteDrawer";
import SuccessfulNotification from "../SuccessfulNotification";
import AddItems from "./AddItems";
import SingleActivityFeed from "./SingleActivityFeed";

const toOrdinalSuffix = (num) => {
  const int = parseInt(num),
    digits = [int % 10, int % 100],
    ordinals = ["st", "nd", "rd", "th"],
    oPattern = [1, 2, 3, 4],
    tPattern = [11, 12, 13, 14, 15, 16, 17, 18, 19];
  return oPattern.includes(digits[0]) && !tPattern.includes(digits[1])
    ? int + ordinals[digits[0] - 1]
    : int + ordinals[3];
};

export default function ContactDetails() {
  // Admin active menu selection
  AdminNavMenuClassChange("mrm-admin", "contacts");

  const [isActive, setActive] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [tabState, setTabState] = useState(1);
  const urlParams = useParams();
  const [contactData, setContactData] = useState({});
  const [id, setId] = useState(urlParams.id);
  const [refresh, setRefresh] = useState();
  const [refreshFeed, setRefreshFeed] = useState();
  const [selectTag, setSelectTag] = useState(false);
  const [selectList, setSelectList] = useState(false);
  const [isEmailForm, setIsEmailForm] = useState(true);
  const [isClose, setIsClose] = useState(true);
  const [isNoteForm, setIsNoteForm] = useState(true);
  const [isCloseNote, setIsCloseNote] = useState(true);
  const [assignLists, setAssignLists] = useState([]);
  const [assignTags, setAssignTags] = useState([]);
  const [showLoader, setShowLoader] = useState(true);
  const [gender, setGender] = useState(false);
  const [country, setCountry] = useState(true);
  const [countryState, setCountryState] = useState(false);
  const [stateRegion, setStateRegion] = useState(false);
  const [genderButton, setGenderButton] = useState();
  const [countryButton, setCountryButton] = useState();
  const [countryStateButton, setCountryStateButton] = useState();
  const [showTimezone, setShowTimezone] = useState(false);
  const [timezones, setTimezones] = useState([]);
  const [countries, setCountries] = useState([]);
  const [countryStates, setCountryStates] = useState([]);
  const [selectedTimezone, setSelectedTimezone] = useState();
  const [isValidate, setIsValidate] = useState(true);
  const [notificationType, setNotificationType] = useState("success");
  // Prepare contact object
  const [tagListsAdder, setTagListsAdder] = useState({
    lists: [],
    tags: [],
  });

  const timezoneRef = useRef(null);
  const genderRef = useRef(null);
  const stateRef = useRef(null);
  const countryRef = useRef(null);

  const threedotRef = useRef(null);
  const selectListRef = useRef(null);
  const selectTagRef = useRef(null);

  const [listening, setListening] = useState(false);
  useEffect(
    ListenForOutsideClicks(
      listening,
      setListening,
      timezoneRef,
      setShowTimezone
    )
  );
  useEffect(
    ListenForOutsideClicks(listening, setListening, stateRef, setCountryState)
  );

  useEffect(
    ListenForOutsideClicks(listening, setListening, countryRef, setCountry)
  );

  useEffect(
    ListenForOutsideClicks(listening, setListening, genderRef, setGender)
  );

  useEffect(
    ListenForOutsideClicks(listening, setListening, threedotRef, setActive)
  );
  useEffect(
    ListenForOutsideClicks(
      listening,
      setListening,
      selectListRef,
      setSelectList
    )
  );
  useEffect(
    ListenForOutsideClicks(listening, setListening, selectTagRef, setSelectTag)
  );
  const [errors, setErrors] = useState({});

  const [showNotification, setShowNotification] = useState("none");
  const [message, setMessage] = useState("");

  useGlobalStore.setState({
    hideGlobalNav: true,
  });

  // Fetch lists & tags
  useEffect(() => {
    // Get lists
    getLists().then((results) => {
      setLists(results.data);
    });
    // Get tags
    getTags().then((results) => {
      setTags(results.data);
    });

    setTimezones(window.MRM_Vars.timezone_list);
    setCountries(window.MRM_Vars.countries);
    setCountryStates(window.MRM_Vars.states);
  }, [refresh]);

  // lists
  const [lists, setLists] = useState([]);

  // tags
  const [tags, setTags] = useState([]);

  const [customFields, setCustomFields] = useState([]);
  const [searchTimezone, setSearchTimezone] = useState("");
  const [searchCountry, setSearchCountry] = useState("");
  const [searchCountryState, setSearchCountryState] = useState("");
  const [countryCode, setCountryCode] = useState("");

  const navigate = useNavigate();

  const filteredTimezone = useMemo(() => {
    if (searchTimezone) {
      return timezones.filter(
        (timezone) =>
          timezone.value
            .toLowerCase()
            .indexOf(searchTimezone.toLocaleLowerCase()) > -1
      );
    }
    return timezones;
  }, [searchTimezone, timezones]);

  const filteredCountries = useMemo(() => {
    if (searchCountry) {
      return countries.filter(
        (country) =>
          country.title
            .toLowerCase()
            .indexOf(searchCountry.toLocaleLowerCase()) > -1
      );
    }
    return countries;
  }, [searchCountry, countries]);

  const filteredCountryStates = useMemo(() => {
    let allStates;
    if (countryStates[countryCode]) {
      allStates = Object.entries(countryStates[countryCode]);
    }
    if (searchCountryState) {
      return allStates?.filter(
        (state) =>
          state[1]
            .toLowerCase()
            .indexOf(searchCountryState.toLocaleLowerCase()) > -1
      );
    }
    return allStates;
  }, [searchCountryState, countryStates, countryCode]);

  const toggleRefresh = () => {
    setRefresh(!refresh);
  };
  const statusList = ["pending", "subscribed", "unsubscribed"];
  useEffect(() => {
    async function getData() {
      const res = await fetch(
        `${window.MRM_Vars.api_base_url}mrm/v1/contacts/${id}`
      );
      const resJson = await res.json();
      if (resJson.code == 200) {
        setContactData(resJson.data);
        setAssignLists(resJson.data?.lists);
        setAssignTags(resJson.data?.tags);
        setShowLoader(false);
      }
    }

    getCustomFields().then((results) => {
      setCustomFields(results.data);
    });

    getData();
  }, [id, refresh]);

  useEffect(() => {
    getCustomFields().then((results) => {
      setCustomFields(results.data);
    });
  }, []);

  useEffect(() => {
    async function getData() {
      const res = await fetch(
        `${window.MRM_Vars.api_base_url}mrm/v1/contacts/${id}`
      );
      const resJson = await res.json();

      if (resJson.code == 200) {
        setContactData(resJson.data);
        setAssignLists(resJson.data?.lists);
        setAssignTags(resJson.data?.tags);
        setShowLoader(false);
        // setLastUpdate(contactData.updated_at ? contactData.updated_at: contactData.created_at);
      }
    }

    getData();
  }, [refreshFeed]);

  const lastUpdate = contactData.updated_at
    ? contactData.updated_at
    : contactData.created_at;
  const DateFormat = DateTime(contactData.created_at, lastUpdate);
  const day = DateFormat.day;
  const month = DateFormat.month;
  const date = DateFormat.date;
  const year = DateFormat.year;
  const hour = DateFormat.hour;
  const minute = DateFormat.minute;

  const createMonth = DateFormat.createMonth;
  const createDay = DateFormat.createDay;
  const createYear = DateFormat.createYear;

  const toggleTab = (index) => {
    setTabState(index);
  };

  const shoMoreOption = () => {
    setActive(!isActive);
  };

  const showEditMode = () => {
    setEditMode(!editMode);
    toggleRefresh();
  };

  const [isDelete, setIsDelete] = useState("none");
  const [deleteTitle, setDeleteTitle] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");

  // Hide WordPress admin notices
  const location = useLocation();
  const match = matchPath({ path: "contacts/update/:id" }, location.pathname);
  if (match) {
    const elems = document.getElementsByClassName("notice");
    for (var i = 0; i < elems.length; i += 1) {
      elems[i].style.display = "none";
    }
  }

  const validate = (event, name, value) => {
    switch (name) {
      case "email":
        if (!value.length) {
          setErrors({
            ...errors,
            email: "Email address is mandatory",
          });
          setIsValidate(false);
        } else if (
          !new RegExp(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{1,}))$/
          ).test(value)
        ) {
          setErrors({
            ...errors,
            email: "Enter a valid email address",
          });
          setIsValidate(false);
        } else {
          setErrors({});
          setIsValidate(true);
        }
        break;
      case "phone_number":
        if (
          value.length &&
          !new RegExp(
            /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/i
          ).test(value)
        ) {
          setErrors({
            ...errors,
            phone_number: "Enter a valid phone number",
          });
          setIsValidate(false);
        } else {
          setErrors({});
          setIsValidate(true);
        }
        break;
      case "first_name":
        if (value.length > 35) {
          setErrors({
            ...errors,
            first_name: "First name character limit exceeded 35 characters",
          });
          setIsValidate(false);
        } else {
          setErrors({});
          setIsValidate(true);
        }
        break;
      case "last_name":
        if (value.length > 35) {
          setErrors({
            ...errors,
            last_name: "Last name character limit exceeded 35 characters",
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

  const handleUpdate = async () => {
    contactData.meta_fields.gender = genderButton;
    contactData.meta_fields.timezone = selectedTimezone;
    contactData.meta_fields.country = countryButton;
    contactData.meta_fields.state = countryStateButton;
    if (isValidate) {
      const res = await fetch(
        `${window.MRM_Vars.api_base_url}mrm/v1/contacts/${contactData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(contactData),
        }
      );
      const responseData = await res.json();
      const code = responseData?.code;

      if (code === 201) {
        setNotificationType("success");
        setShowNotification("block");
        setMessage(responseData?.message);
        toggleRefresh();
        showEditMode();
      } else {
        // Validation messages
        setErrors({
          ...errors,
          email: responseData?.message,
        });
      }
    }

    ClearNotification("none", setShowNotification);
  };

  //to open input field to add new tag to a contact
  const [openTagSelectBox, setOpenTagSelectBox] = useState(false);
  const addTagInput = () => {
    setOpenTagSelectBox(!openTagSelectBox);
  };

  //to open input field to add new list to a contact
  const [openListSelectBox, setOpenListSelectBox] = useState(false);
  const addListInput = () => {
    setOpenListSelectBox(!openListSelectBox);
  };

  // Set values from contact form
  const handleChange = (event) => {
    const { name, value } = event.target;

    validate(event, name, value);
    setContactData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleMetaChange = (e) => {
    const { name, value } = e.target;
    validate(e, name, value);

    setContactData((prevState) => ({
      ...prevState,
      meta_fields: {
        ...prevState.meta_fields,
        [name]: value,
      },
    }));
  };

  const [selectedCheckboxItems, setSelectedCheckboxItems] = useState([]);
  const [checkboxName, setCheckboxName] = useState("");

  const modifyContactData = (name, value, id, checked) => {
    let modifiedContact = contactData;

    if (modifiedContact.meta_fields[name] !== undefined) {
      if (checked) {
        modifiedContact.meta_fields[name].push(value);
      } else {
        let idx = modifiedContact.meta_fields[name].indexOf(value);
        modifiedContact.meta_fields[name].splice(idx, 1);
      }
    } else {
      let dataArray = [value];
      modifiedContact.meta_fields[name] = dataArray;
    }

    //setContactData([modifiedContact]);

    console.log(modifiedContact);
  };

  const handleChekcboxFields = (e) => {
    const { name, value, id, checked } = e.target;

    modifyContactData(name, value, id, checked);

    setCheckboxName(name);

    const index = selectedCheckboxItems?.findIndex(
      (item) => item.id == name + "-" + id
    );

    if (index >= 0) {
      setSelectedCheckboxItems(
        selectedCheckboxItems.filter((item) => item.id != name + "-" + id)
      );
    } else {
      // add id to the array
      setSelectedCheckboxItems([
        ...selectedCheckboxItems,
        { id: name + "-" + id, name: name, value: value },
      ]);
    }
  };

  useEffect(() => {
    console.log(contactData);
  }, [contactData]);

  const onSelect = (e, name) => {
    const updatedOptions = [...e.target.options]
      .filter((option) => option.selected)
      .map((x) => x.value);

    setTagListsAdder((prevState) => ({
      ...prevState,
      [name]: updatedOptions,
    }));
  };

  const onRemove = (e, name) => {
    let unselectedItem = e.params.data.id;
    setTagListsAdder((prevState) => ({
      ...prevState,
      [name]: prevState[name].filter((x) => x !== unselectedItem),
    }));
  };

  const handleStatus = async (status) => {
    const res = await fetch(
      `${window.MRM_Vars.api_base_url}mrm/v1/contacts/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ status: status }),
      }
    );
    const responseData = await res.json();
    const code = responseData?.code;
    if (code === 201) {
      setNotificationType("success");
      setShowNotification("block");
      setMessage(responseData?.message);
      toggleRefresh();
    } else {
      // Validation messages
      setErrors({
        ...errors,
        email: responseData?.message,
      });
    }
    ClearNotification("none", setShowNotification);
  };

  // Send Double opt-in email
  const handleDoubleOptin = async () => {
    const res = await fetch(
      `${window.MRM_Vars.api_base_url}mrm/v1/contacts/${id}/send-double-opt-in`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
      }
    );
    const responseData = await res.json();
    const code = responseData?.code;
    if (code === 200) {
      setNotificationType("success");
      setShowNotification("block");
      setMessage(responseData?.message);
    } else {
      // Validation messages
      setNotificationType("warning");
      setShowNotification("block");
      setMessage(responseData?.message);
    }
    toggleRefresh();
    ClearNotification("none", setShowNotification);
  };

  const handleDelete = () => {
    setIsDelete("block");
    setDeleteTitle("Delete Contact");
    setDeleteMessage("Are you sure you want to delete the contact?");
  };

  // Delete contact after delete confirmation
  const onDeleteStatus = async (status) => {
    if (status) {
      deleteSingleContact(id).then((result) => {
        if (200 === result.code) {
          navigate("../contacts", {
            state: {
              status: "contact-created",
              message: result?.message,
            },
          });
        }
      });
    }
    setIsDelete("none");
  };

  // Hide delete popup after click on cancel
  const onDeleteShow = async (status) => {
    setIsDelete(status);
  };

  const handleTagListDelete = async (id) => {
    const res = await fetch(
      `${window.MRM_Vars.api_base_url}mrm/v1/contacts/${contactData.id}/groups`,
      {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ groups: [id] }),
      }
    );
    const resJson = await res.json();
    if (resJson.code == 200) {
      setNotificationType("success");
      setShowNotification("block");
      setMessage(resJson.message);
    }
    toggleRefresh();
    ClearNotification("none", setShowNotification);
  };

  const selectTags = () => {
    setSelectTag(!selectTag);
  };
  const selectLists = () => {
    setSelectList(!selectList);
  };

  const emailForm = () => {
    setIsEmailForm(true);
    setIsClose(!isClose);
  };
  const noteForm = () => {
    setIsNoteForm(true);
    setIsCloseNote(!isCloseNote);
  };

  const handleGender = () => {
    setGender(!gender);
  };
  const handleCountryState = () => {
    setCountryState(!countryState);
  };
  const handleCountry = () => {
    setCountry(!country);
  };

  const handleTimezoneShow = () => {
    setShowTimezone(!showTimezone);
  };

  const handleSelect = (e, name, gender) => {
    setGender(false);
    if (name == "gender" && gender == "male") {
      setGenderButton("Male");
    } else if (name == "gender" && gender == "female") {
      setGenderButton("Female");
    } else {
      setGenderButton("Others");
    }
    setContactData((prevState) => ({
      ...prevState,
      meta_fields: {
        [name]: genderButton,
      },
    }));
  };

  const handleCountrySelect = (e, name, value) => {
    setCountry(false);
    setCountryButton(value);
    setCountryCode(name);
    setCountryStateButton("");

    setContactData((prevState) => ({
      ...prevState,
      meta_fields: {
        ["country"]: countryButton,
      },
    }));

    // setContactData((prevState) => ({
    //   ...prevState,
    //   meta_fields: {
    //     ["country"]: value,
    //   },
    // }));
  };

  const handleCountryStateSelect = (e, name, value) => {
    setCountryState(false);
    setCountryStateButton(value);

    setContactData((prevState) => ({
      ...prevState,
      meta_fields: {
        ["state"]: countryStateButton,
      },
    }));
  };

  const handleTimezoneSelect = (event, id, value) => {
    setSelectedTimezone(value);
    setShowTimezone(!showTimezone);

    setContactData((prevState) => ({
      ...prevState,
      meta_fields: {
        ["timezone"]: countryStateButton,
      },
    }));
  };

  return (
    <>
      <div className="mintmrm-contact-details">
        {showLoader ? (
          <LoadingIndicator type="table" />
        ) : (
          <div className="contact-details-wrapper">
            <div className="mintmrm-container">
              <div className="contact-details-header">
                <div className="contact-author-info">
                  <div className="author-img">
                    <img
                      src={contactData.avatar_url}
                      alt="contact-author-img"
                      style={{ borderRadius: "50%" }}
                    />
                  </div>

                  <div className="author-short-details">
                    <div className="back-button">
                      <DoubleAngleLeftIcon />
                      <Link to={`../contacts`}>Back</Link>
                    </div>
                    <div className="author-name-status">
                      {contactData.first_name || contactData.last_name ? (
                        <h2 className="author-name">
                          {contactData.first_name} {contactData.last_name}{" "}
                        </h2>
                      ) : (
                        <h2 className="author-name">Untitled</h2>
                      )}

                      {contactData.status == "subscribed" ? (
                        <span className="subscribe">Subscribed</span>
                      ) : contactData.status == "unsubscribed" ? (
                        <span className="unsubscribe">Unsubscribed</span>
                      ) : (
                        <span className="pending">Pending</span>
                      )}
                    </div>

                    <p>
                      Added via {contactData.added_by_login} on {createMonth}{" "}
                      {toOrdinalSuffix(createDay)}, {createYear} at{" "}
                      {contactData.created_time}
                    </p>
                    {contactData.status == "pending" && (
                      <div
                        className="double-optin-info"
                        onClick={() => handleDoubleOptin()}
                      >
                        Send Double Optin Email
                      </div>
                    )}

                    {/* <div className="rating">
                  <span>
                    <StarIcon />
                  </span>
                  <span>
                    <StarIcon />
                  </span>
                  <span>
                    <StarIcon />
                  </span>
                  <span>
                    <StarIcon />
                  </span>
                  <span>
                    <StarIcon />
                  </span>
                </div> */}
                  </div>
                </div>

                <div className="contact-author-mailing">
                  <button className="create-note" onClick={noteForm}>
                    <CreateNoteIcon />
                  </button>

                  <button className="create-mail" onClick={emailForm}>
                    <EmailIcon />
                  </button>

                  <div className="pos-relative" ref={threedotRef}>
                    <button className="more-option" onClick={shoMoreOption}>
                      <ThreeDotIcon />
                    </button>
                    <ul
                      className={
                        isActive ? "mintmrm-dropdown show" : "mintmrm-dropdown"
                      }
                    >
                      {statusList.map((status, index) => {
                        return (
                          <>
                            {contactData.status != status && (
                              <li
                                key={index}
                                onClick={() => handleStatus(status)}
                              >
                                {status.charAt(0).toUpperCase() +
                                  status.slice(1)}
                              </li>
                            )}
                          </>
                        );
                      })}

                      <li className="delete" onClick={handleDelete}>
                        Delete
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="contact-details-body">
                <div className="contact-details-left">
                  <ul className="profile-info-nav">
                    <li
                      className={tabState === 1 ? "active" : ""}
                      onClick={() => toggleTab(1)}
                    >
                      Profile
                    </li>

                    <li
                      className={tabState === 2 ? "active" : ""}
                      onClick={() => toggleTab(2)}
                    >
                      Activities
                    </li>
                  </ul>

                  <div
                    className={
                      editMode
                        ? "info-nav-content is-edit-mode"
                        : "info-nav-content"
                    }
                  >
                    <div
                      className={
                        tabState === 1
                          ? "profile-nav-content active"
                          : "profile-nav-content"
                      }
                    >
                      <ul className="basic-detail-info">
                        <h4>
                          Basic Information
                          <button
                            className="edit-button"
                            onClick={showEditMode}
                          >
                            <EditButton />
                          </button>
                        </h4>
                        <li>
                          <span className="title">Email</span>
                          <span className="title-value">
                            {contactData.email}
                          </span>
                        </li>
                        <li>
                          <span className="title">First Name</span>
                          <span className="title-value">
                            {contactData.first_name}
                          </span>
                        </li>
                        <li>
                          <span className="title">Last Name</span>
                          <span className="title-value">
                            {contactData.last_name}
                          </span>
                        </li>
                        <li>
                          <span className="title">Phone Number</span>
                          <span className="title-value">
                            {contactData?.meta_fields?.phone_number
                              ? contactData?.meta_fields?.phone_number
                              : "-"}
                          </span>
                        </li>
                        <li>
                          <span className="title">Date of Birth</span>
                          <span className="title-value">
                            {contactData?.meta_fields?.date_of_birth
                              ? contactData?.meta_fields?.date_of_birth
                              : "-"}
                          </span>
                        </li>
                        <li>
                          <span className="title">Gender</span>
                          <span className="title-value">
                            {contactData?.meta_fields?.gender
                              ? contactData?.meta_fields?.gender
                              : "-"}
                          </span>
                        </li>
                      </ul>
                      <ul className="basic-detail-info">
                        <h4>Address</h4>
                        <li>
                          <span className="title">Address Line 1</span>
                          <span className="title-value">
                            {contactData?.meta_fields?.address_line_1
                              ? contactData?.meta_fields?.address_line_1
                              : "-"}
                          </span>
                        </li>
                        <li>
                          <span className="title">Address Line 2</span>
                          <span className="title-value">
                            {contactData?.meta_fields?.address_line_2
                              ? contactData?.meta_fields?.address_line_2
                              : "-"}
                          </span>
                        </li>
                        <li>
                          <span className="title">City</span>
                          <span className="title-value">
                            {contactData?.meta_fields?.city
                              ? contactData?.meta_fields?.city
                              : "-"}
                          </span>
                        </li>
                        <li>
                          <span className="title">State / Province</span>
                          <span className="title-value">
                            {contactData?.meta_fields?.state
                              ? contactData?.meta_fields?.state
                              : "-"}
                          </span>
                        </li>
                        <li>
                          <span className="title">Postal / Zip</span>
                          <span className="title-value">
                            {contactData?.meta_fields?.postal
                              ? contactData?.meta_fields?.postal
                              : "-"}
                          </span>
                        </li>
                        <li>
                          <span className="title">Country</span>
                          <span className="title-value">
                            {contactData?.meta_fields?.country
                              ? contactData?.meta_fields?.country
                              : "-"}
                          </span>
                        </li>
                      </ul>
                      <ul className="other-detail-info">
                        <h4>Other</h4>
                        <li>
                          <span className="title">Timezone</span>
                          <span className="title-value">
                            {contactData?.meta_fields?.timezone
                              ? contactData?.meta_fields?.timezone
                              : "-"}
                          </span>
                        </li>
                        <li>
                          <span className="title">Company</span>
                          <span className="title-value">
                            {contactData?.meta_fields?.company
                              ? contactData?.meta_fields?.company
                              : "-"}
                          </span>
                        </li>
                        <li>
                          <span className="title">Designation</span>
                          <span className="title-value">
                            {contactData?.meta_fields?.designation
                              ? contactData?.meta_fields?.designation
                              : "-"}
                          </span>
                        </li>
                        <li>
                          <span className="title">Last Update</span>
                          <span className="title-value">
                            {day}, {month} {date}, {year}
                          </span>
                        </li>

                        {customFields.map((field) => {
                          if ("checkboxField" === field.type) {
                            return (
                              <>
                                <li key={field.id}>
                                  <span className="title">
                                    {field.meta.label
                                      ? field.meta.label
                                      : field.title}
                                  </span>
                                  <span className="title-value">
                                    {contactData?.meta_fields?.[field.title]
                                      ? contactData?.meta_fields?.[field.title]
                                      : "-"}
                                  </span>
                                </li>
                              </>
                            );
                          }

                          return (
                            <>
                              <li key={field.id}>
                                <span className="title">
                                  {field.meta.label
                                    ? field.meta.label
                                    : field.title}
                                </span>
                                <span className="title-value">
                                  {contactData?.meta_fields?.[field.title]
                                    ? contactData?.meta_fields?.[field.title]
                                    : "-"}
                                </span>
                              </li>
                            </>
                          );
                        })}
                      </ul>

                      <div className="profile-edit-field">
                        <div className="basic-info-edit">
                          <h4>Basic Information</h4>
                          <div className="edit-input-field">
                            <InputItem
                              name="email"
                              label="Email"
                              handleChange={handleChange}
                              error={errors?.email}
                              isRequired
                              value={contactData.email}
                              type="email"
                            />
                            <InputItem
                              name="first_name"
                              handleChange={handleChange}
                              error={errors?.first_name}
                              label="First name"
                              value={contactData.first_name}
                            />
                            <InputItem
                              name="last_name"
                              handleChange={handleChange}
                              error={errors?.last_name}
                              label="Last name"
                              value={contactData.last_name}
                            />
                            <InoutPhone
                              name="phone_number"
                              handleChange={handleMetaChange}
                              label="Phone number"
                              error={errors?.phone_number}
                              value={contactData?.meta_fields?.phone_number}
                            />
                            <InputDate
                              name="date_of_birth"
                              label="Date of Birth"
                              handleChange={handleMetaChange}
                              value={contactData?.meta_fields?.date_of_birth}
                            />
                            <div
                              className="form-group contact-input-field"
                              ref={genderRef}
                            >
                              <label name="gender">Gender</label>
                              <button
                                className="gender-button"
                                onClick={handleGender}
                              >
                                {genderButton
                                  ? genderButton
                                  : contactData?.meta_fields.gender
                                  ? contactData?.meta_fields.gender
                                  : "Select Gender"}
                              </button>
                              <ul
                                className={
                                  gender
                                    ? "mintmrm-dropdown show"
                                    : "mintmrm-dropdown"
                                }
                              >
                                <li
                                  onClick={(event) =>
                                    handleSelect(event, "gender", "male")
                                  }
                                >
                                  Male
                                </li>
                                <li
                                  onClick={(event) =>
                                    handleSelect(event, "gender", "female")
                                  }
                                >
                                  Female
                                </li>
                                <li
                                  onClick={(event) =>
                                    handleSelect(event, "gender", "others")
                                  }
                                >
                                  Others
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="adress-info-edit">
                            <h4>Address</h4>
                            <div className="adress-input-field">
                              <InputItem
                                name="address_line_1"
                                handleChange={handleMetaChange}
                                value={contactData?.meta_fields?.address_line_1}
                                label="Address Line 1"
                              />
                              <InputItem
                                name="address_line_2"
                                handleChange={handleMetaChange}
                                value={contactData?.meta_fields?.address_line_2}
                                label="Address Line 2"
                              />
                              <InputItem
                                name="city"
                                handleChange={handleMetaChange}
                                value={contactData?.meta_fields?.city}
                                label="City"
                              />
                              <InputItem
                                name="postal"
                                handleChange={handleMetaChange}
                                value={contactData?.meta_fields?.postal}
                                label="Postal / Zip"
                              />
                              <div
                                className="form-group contact-input-field"
                                ref={countryRef}
                              >
                                <label name="country">Country</label>
                                <button
                                  className="country-button"
                                  onClick={handleCountry}
                                >
                                  {countryButton
                                    ? countryButton
                                    : contactData?.meta_fields.country
                                    ? contactData?.meta_fields.country
                                    : "Select Country"}
                                </button>
                                <ul
                                  className={
                                    country
                                      ? "mintmrm-dropdown country show"
                                      : "mintmrm-dropdown"
                                  }
                                >
                                  <li className="searchbar">
                                    <span class="pos-relative">
                                      <Search />
                                      <input
                                        type="search"
                                        name="column-search"
                                        placeholder="Seacrh..."
                                        value={searchCountry}
                                        onChange={(e) =>
                                          setSearchCountry(e.target.value)
                                        }
                                      />
                                    </span>
                                  </li>
                                  <div className="option-section">
                                    {filteredCountries?.length > 0 &&
                                      filteredCountries?.map((country) => {
                                        return (
                                          <li
                                            key={country.code}
                                            onClick={(event) =>
                                              handleCountrySelect(
                                                event,
                                                country.code,
                                                country.title
                                              )
                                            }
                                          >
                                            {country.title}
                                          </li>
                                        );
                                      })}
                                  </div>
                                </ul>
                              </div>
                              <div
                                className="form-group contact-input-field"
                                ref={stateRef}
                              >
                                <label name="state">State / Province</label>
                                <button
                                  className="state-prove-region-button"
                                  onClick={handleCountryState}
                                >
                                  {countryStateButton !== undefined
                                    ? "" == countryStateButton
                                      ? "Select State"
                                      : countryStateButton
                                    : contactData?.meta_fields.state
                                    ? contactData?.meta_fields.state
                                    : "Select State"}
                                </button>
                                <ul
                                  className={
                                    countryState
                                      ? "mintmrm-dropdown state show"
                                      : "mintmrm-dropdown"
                                  }
                                >
                                  <li className="searchbar">
                                    <span class="pos-relative">
                                      <Search />
                                      <input
                                        type="search"
                                        name="column-search"
                                        placeholder="Seacrh..."
                                        value={searchCountryState}
                                        onChange={(e) =>
                                          setSearchCountryState(e.target.value)
                                        }
                                      />
                                    </span>
                                  </li>
                                  <div className="option-section">
                                    {filteredCountryStates &&
                                      filteredCountryStates?.map((state) => {
                                        return (
                                          <li
                                            key={state[0]}
                                            onClick={(event) =>
                                              handleCountryStateSelect(
                                                event,
                                                state[0],
                                                state[1]
                                              )
                                            }
                                          >
                                            {state[1]}
                                          </li>
                                        );
                                      })}
                                  </div>
                                </ul>
                              </div>
                              {/* <InputItem
                                name="state"
                                handleChange={handleMetaChange}
                                value={contactData?.meta_fields?.state}
                                label="State / Province"
                              /> */}
                            </div>
                          </div>
                        </div>
                        <div className="other-info-edit">
                          <h4>Other</h4>
                          <div className="edit-input-field">
                            <InputItem
                              name="company"
                              handleChange={handleMetaChange}
                              label="Company"
                              value={contactData?.meta_fields?.company}
                            />
                            <InputItem
                              name="designation"
                              handleChange={handleMetaChange}
                              label="Designation"
                              value={contactData?.meta_fields?.designation}
                            />
                            <div
                              className="form-group contact-input-field"
                              ref={timezoneRef}
                            >
                              <label name="timezone">Timezone</label>
                              <button
                                className="timezone-button"
                                onClick={handleTimezoneShow}
                              >
                                {selectedTimezone
                                  ? selectedTimezone
                                  : contactData?.meta_fields.timezone
                                  ? contactData?.meta_fields.timezone
                                  : "Select Timezone"}
                              </button>
                              <ul
                                className={
                                  showTimezone
                                    ? "mintmrm-dropdown timezone show"
                                    : "mintmrm-dropdown timezone"
                                }
                              >
                                <li className="searchbar">
                                  <span class="pos-relative">
                                    <Search />
                                    <input
                                      type="search"
                                      name="column-search"
                                      placeholder="Seacrh..."
                                      value={searchTimezone}
                                      onChange={(e) =>
                                        setSearchTimezone(e.target.value)
                                      }
                                    />
                                  </span>
                                </li>
                                <div className="option-section">
                                  {filteredTimezone?.length > 0 &&
                                    filteredTimezone?.map((timezone) => {
                                      return (
                                        <li
                                          key={timezone.id}
                                          onClick={(event) =>
                                            handleTimezoneSelect(
                                              event,
                                              timezone.id,
                                              timezone.value
                                            )
                                          }
                                        >
                                          {timezone.value}
                                        </li>
                                      );
                                    })}
                                </div>
                              </ul>
                            </div>

                            {customFields.map((field) => {
                              return (
                                <>
                                  {field.type == "text" && (
                                    <InputItem
                                      key={field.id}
                                      name={field.title}
                                      label={field.meta.label}
                                      placeholder={field.meta.placeholder}
                                      handleChange={handleMetaChange}
                                      value={
                                        contactData?.meta_fields?.[field.title]
                                      }
                                    />
                                  )}

                                  {field.type == "number" && (
                                    <InputNumber
                                      name={field.title}
                                      label={field.meta.label}
                                      placeholder={field.meta.placeholder}
                                      handleChange={handleMetaChange}
                                      value={
                                        contactData?.meta_fields?.[field.title]
                                      }
                                    />
                                  )}

                                  {field.type == "textArea" && (
                                    <InputTextArea
                                      name={field.title}
                                      label={field.meta.label}
                                      placeholder={field.meta.placeholder}
                                      handleChange={handleMetaChange}
                                      value={
                                        contactData?.meta_fields?.[field.title]
                                      }
                                    />
                                  )}

                                  {console.log(field)}

                                  {field.type == "selectField" && (
                                    <InputSelect
                                      name={field.title}
                                      label={field.meta.label}
                                      placeholder={field.meta.placeholder}
                                      selectOption={field.meta.options}
                                      handleChange={handleMetaChange}
                                      selectedValue={
                                        contactData?.meta_fields?.[field.title]
                                      }
                                      value={
                                        contactData?.meta_fields?.[field.title]
                                      }
                                    />
                                  )}

                                  {field.type == "radioField" && (
                                    <InputRadio
                                      name={field.title}
                                      label={field.meta.label}
                                      placeholder={field.meta.placeholder}
                                      selectOption={field.meta.options}
                                      selectedValue={
                                        contactData?.meta_fields?.[field.title]
                                      }
                                      handleChange={handleMetaChange}
                                      value={
                                        contactData?.meta_fields?.[field.title]
                                      }
                                    />
                                  )}

                                  {field.type == "checkboxField" && (
                                    <InputCheckbox
                                      name={field.title}
                                      label={field.meta.label}
                                      placeholder={field.meta.placeholder}
                                      selectOption={field.meta.options}
                                      handleChange={handleChekcboxFields}
                                      value={
                                        contactData?.meta_fields?.[field.id]
                                      }
                                    />
                                  )}
                                </>
                              );
                            })}
                          </div>
                        </div>

                        <div className="save-cancel-button">
                          <button
                            className="mintmrm-btn outline cancel-btn"
                            onClick={showEditMode}
                          >
                            Cancel
                          </button>

                          <button
                            className="save-button mintmrm-btn"
                            onClick={handleUpdate}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>

                    <div
                      className={
                        tabState === 2
                          ? "profile-nav-activities active"
                          : "profile-nav-activities"
                      }
                    >
                      <div className="activities-header">
                        <h4 className="title">Activity Feed</h4>
                        {/* <Selectbox
                        name="type"
                        options={[
                          {
                            title: "Text",
                            id: "text",
                          },
                          {
                            title: "Date",
                            id: "date",
                          },
                          {
                            title: "Number",
                            id: "number",
                          },
                        ]}
                        tags={false}
                        placeholder="All activity"
                        multiple={false}
                        value={customFields.type}
                        onSelect={onSelect}
                        error={errors?.type}
                        index="profile-activity"
                      /> */}
                      </div>

                      <div className="activities-feed-wrapper">
                        {contactData?.activities.length == 0 ? (
                          <div className="no-activity">
                            <NoActivityIcon />
                            No Activity Found
                          </div>
                        ) : (
                          <SingleActivityFeed
                            notes={contactData?.notes}
                            messages={contactData?.messages}
                            activities={contactData?.activities}
                            contactId={contactData?.id}
                            refresh={refreshFeed}
                            setRefresh={setRefreshFeed}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {/* end .contact-details-left */}

                <div className="contact-details-right">
                  {/* <div className="contact-stats">
                <div className="single-stat total-revenue">
                  <h2 className="stat">
                    $1,700
                    <ArrowIconXsml />
                  </h2>
                  <span className="stat-title">Total Revenue</span>
                </div>

                <div className="single-stat open-rate">
                  <h2 className="stat">
                    $1,700
                    <ArrowIconXsml />
                  </h2>
                  <span className="stat-title">Open rate</span>
                </div>

                <div className="single-stat click-rate">
                  <h2 className="stat">
                    $1,700
                    <ArrowIconXsml />
                  </h2>
                  <span className="stat-title">Click Rate</span>
                </div>

                <div className="single-stat total-order">
                  <h2 className="stat">
                    $1,700
                    <ArrowIconXsml />
                  </h2>
                  <span className="stat-title">Total Order</span>
                </div>
              </div> */}

                  {/* <hr /> */}

                  <div className="lists">
                    <div className="title-section">
                      <h4 className="title">Lists</h4>
                      {contactData?.lists.length == 0 && (
                        <div className="no-item-found">No list found</div>
                      )}
                    </div>
                    <div ref={selectListRef}>
                      <div className="list-wrapper">
                        {contactData?.lists?.map((list) => {
                          return (
                            <span className="single-list" key={list.id}>
                              {list.title}

                              <button
                                className="close-list"
                                title="Delete"
                                onClick={() => {
                                  handleTagListDelete(list.id);
                                }}
                              >
                                <CrossIcon />
                              </button>
                            </span>
                          );
                        })}
                        {/* {contactData?.lists?.length == 0 && (
                      <span>No List Found </span>
                    )} */}
                        <button className="add-list" onClick={selectLists}>
                          <PlusIconSmall /> Add List
                        </button>
                      </div>
                      <AddItems
                        selected={assignLists}
                        setSelected={setAssignLists}
                        endpoint="lists"
                        placeholder="List"
                        name="list"
                        listTitle="CHOOSE LIST"
                        listTitleOnNotFound="No Data Found"
                        searchPlaceHolder="Search..."
                        allowMultiple={true}
                        showSearchBar={true}
                        showListTitle={true}
                        showSelectedInside={false}
                        allowNewCreate={true}
                        setIsAssignTo={setSelectList}
                        contactId={id}
                        refresh={refresh}
                        setRefresh={setRefresh}
                        isActive={selectList}
                      />
                    </div>
                  </div>

                  <div className="tags">
                    <div className="title-section">
                      <h4 className="title">Tags</h4>
                      {contactData?.tags.length == 0 && (
                        <div className="no-item-found">No tag found</div>
                      )}
                    </div>
                    <div ref={selectTagRef}>
                      <div className="tag-wrapper">
                        {contactData?.tags?.map((tag) => {
                          return (
                            <span className="single-list" key={tag.id}>
                              {tag.title}
                              <button
                                className="close-list"
                                title="Delete"
                                onClick={() => {
                                  handleTagListDelete(tag.id);
                                }}
                              >
                                <CrossIcon />
                              </button>
                            </span>
                          );
                        })}

                        {/* {contactData?.tags?.length == 0 && <span>No Tag Found  </span>} */}
                        <button className="add-list" onClick={selectTags}>
                          <PlusIconSmall /> Add Tag
                        </button>
                      </div>
                      {selectTag && (
                        <AddItems
                          selected={assignTags}
                          setSelected={setAssignTags}
                          endpoint="tags"
                          placeholder="Tags"
                          name="tag"
                          listTitle="CHOOSE Tag"
                          listTitleOnNotFound="No Data Found"
                          searchPlaceHolder="Search..."
                          allowMultiple={true}
                          showSearchBar={true}
                          showListTitle={true}
                          showSelectedInside={false}
                          allowNewCreate={true}
                          isActive={selectTag}
                          setIsAssignTo={setSelectTag}
                          contactId={id}
                          refresh={refresh}
                          setRefresh={setRefresh}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <EmailDrawer
              isOpen={isEmailForm}
              isClose={isClose}
              setIsClose={setIsClose}
              contact={contactData}
              refresh={refresh}
              setRefresh={setRefresh}
            />

            <NoteDrawer
              isOpenNote={isNoteForm}
              isCloseNote={isCloseNote}
              setIsCloseNote={setIsCloseNote}
              contactID={id}
              refresh={refreshFeed}
              setRefresh={setRefreshFeed}
            />
          </div>
        )}
      </div>
      <div className="mintmrm-container" style={{ display: isDelete }}>
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
        message={message}
        notificationType={notificationType}
        setNotificationType={setNotificationType}
      />
    </>
  );
}
