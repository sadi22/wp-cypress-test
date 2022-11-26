import React, { useEffect, useRef, useState } from "react";
import AlertPopup from "../../components/AlertPopup";
import DeletePopup from "../../components/DeletePopup";
import CopyIcon from "../../components/Icons/CopyIcon";
import Delete from "../../components/Icons/Delete";
import EditIcon from "../../components/Icons/EditIcon";
import FormIconSM from "../../components/Icons/FormIconSM";
import FormIconXL from "../../components/Icons/FormIconXL";
import Plus from "../../components/Icons/Plus";
import Search from "../../components/Icons/Search";
import ThreeDotIcon from "../../components/Icons/ThreeDotIcon";
import ListenForOutsideClicks from "../../components/ListenForOutsideClicks";
import LoadingIndicator from "../../components/LoadingIndicator";
import Pagination from "../../components/Pagination";
import SuccessfulNotification from "../../components/SuccessfulNotification";
import { useGlobalStore } from "../../hooks/useGlobalStore";
import {
  AddSuccessNotification,
  ClearNotification,
} from "../../utils/admin-notification";
import { AdminNavMenuClassChange } from "../../utils/admin-settings";
import FormTemplate from "./FormTemplate";

export default function FormIndex(props) {
  // Admin active menu selection
  AdminNavMenuClassChange("mrm-admin", "forms");

  /*
   * declaring variables
   */

  // contains all the info of Form Data
  const [formData, setFormData] = useState({});

  // loading or not
  const [loading, setLoading] = useState(false);

  // how many forms to show per page
  const [perPage, setPerPage] = useState(10);

  // current page
  const [page, setPage] = useState(1);

  // total count of results
  const [count, setCount] = useState(0);

  // total number of pages for result
  const [totalPages, setTotalPages] = useState(0);

  // search input value is stored here
  const [search, setSearch] = useState("");

  // search query, search query only updates when any characters typed
  // we can add any number to start searching after hitting that number of characters
  const [query, setQuery] = useState("");

  // refresh the whole list if this boolean changes
  const [refresh, setRefresh] = useState(true);

  // current active menu id, whenever a option button is selected this
  // var tracks the current id of
  const [currentActive, setCurrentActive] = useState(0);

  // the select all checkbox
  const [allSelected, setAllSelected] = useState(false);

  // single selected array which holds selected ids
  const [selected, setSelected] = useState([]);

  // whether to show more options or not
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  // bulk action menu
  const [isBulkAction, setBulkAction] = useState(false);

  // to send any error message
  const [errors, setErrors] = useState({});

  // get Id of any selected form
  const [formId, setFormId] = useState();

  // Variables to show notifications
  const [showNotification, setShowNotification] = useState("none");
  const [notificationType, setNotificationType] = useState("success");
  const [message, setMessage] = useState("");
  const [isDelete, setIsDelete] = useState("none");
  const [deleteTitle, setDeleteTitle] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");
  const [showAlert, setShowAlert] = useState("none");

  // sort by option toggle option
  const [toggleDropdown, setToggleDropdown] = useState(false);
  // sorting options variables
  const [sortBy, setSortBy] = useState("Date");
  const [sortByType, setSortByType] = useState("DESC");

  // global counter update real time
  const counterRefresh = useGlobalStore((state) => state.counterRefresh);

  // to select template or build for scratch
  const [isClose, setIsClose] = useState(true);
  const [isTemplate, setIsTemplate] = useState(true);

  // status checkbox states
  const [state, setState] = useState({
    checkedA: true,
    checkedB: false,
  });

  // to show bulk select options
  const showBulkAction = () => {
    setBulkAction(!isBulkAction);
  };

  // Hide delete popup after click on cancel
  const onDeleteShow = async (status) => {
    setIsDelete(status);
  };

  const [listening, setListening] = useState(false);

  // Outside click events for bulk action dropdown
  const threeDotRef = useRef(null);
  useEffect(
    ListenForOutsideClicks(
      listening,
      setListening,
      threeDotRef,
      setShowMoreOptions
    )
  );

  // shrink title
  const [titleShrink, setTitleShrink] = useState("");

  /*
   * Hooks
   */

  // at first page load get all the available lists
  // also get lists if the page or perpage or search item changes
  useEffect(() => {
    async function getForms() {
      setLoading(true);
      const res = await fetch(
        `${window.MRM_Vars.api_base_url}mrm/v1/forms?order-by=${sortBy}&order-type=${sortByType}&page=${page}&per-page=${perPage}${query}`
      );
      const resJson = await res.json();
      if (200 === resJson.code) {
        setFormData(resJson.data.data);
        setCount(resJson.data.count);
        setTotalPages(resJson.data.total_pages);
        setLoading(false);
      }
    }
    getForms();
    ClearNotification("none", setShowNotification);
  }, [page, perPage, query, refresh, sortBy]);

  /*
   * Functions
   */

  // the data is fetched again whenever refresh is changed
  function toggleRefresh() {
    setRefresh(!refresh);
  }

  // Hide alert popup after click on ok
  const onShowAlert = async (status) => {
    setShowAlert(status);
  };

  // confirmation for delete and set form id to prepare deletation
  const deleteForm = async (formId) => {
    setIsDelete("block");
    setDeleteTitle("Delete List");
    setDeleteMessage("Are you sure you want to delete the form?");
    setFormId(formId);
    setAllSelected(false);
    setSelected([]);
    setBulkAction(false);
  };

  // Delete form after delete confirmation
  const onDeleteStatus = async (status) => {
    if (status) {
      await fetch(`${window.MRM_Vars.api_base_url}mrm/v1/forms/${formId}`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((response) => {
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
    setIsDelete("none");
  };

  // Multiple selection confirmation
  const deleteMultipleList = async () => {
    if (selected.length > 0) {
      setIsDelete("block");
      setDeleteTitle("Delete Multiple");
      setDeleteMessage("Are you sure you want to delete these selected items?");
    } else {
      setShowAlert("block");
    }
  };

  // Delete multiple forms after delete confirmation
  const onMultiDelete = async (status) => {
    if (status && selected.length > 0) {
      await fetch(`${window.MRM_Vars.api_base_url}mrm/v1/forms/`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          form_ids: selected,
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          if (200 === response.code) {
            setNotificationType("success");
            setShowNotification("block");
            setMessage(response.message);
            toggleRefresh();
            setAllSelected(false);
            setSelected([]);
            showBulkAction(false);
          } else {
            setErrors({
              ...errors,
              title: response?.message,
            });
          }
        });
    }
    setIsDelete("none");
  };

  // handle and update status of a form
  const statusSwitch = async (event, index) => {
    setState({ ...state, [event.target.name]: event.target.checked });

    const raw_formId = event.target.id;

    const formId = raw_formId.substring(3);

    if (event.target.checked) {
      await fetch(
        `${window.MRM_Vars.api_base_url}mrm/v1/forms/update-status/${formId}`,
        {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ status: "published" }),
        }
      )
        .then((response) => response.json())
        .then((response) => {
          if (201 === response.code) {
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
      ClearNotification("none", setShowNotification);
    } else {
      await fetch(
        `${window.MRM_Vars.api_base_url}mrm/v1/forms/update-status/${formId}`,
        {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ status: "draft" }),
        }
      )
        .then((response) => response.json())
        .then((response) => {
          if (201 === response.code) {
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
      ClearNotification("none", setShowNotification);
    }
  };

  // open form builder after the template modal
  const redirectFormBuilder = () => {
    setIsTemplate(true);
    setIsClose(!isClose);
  };

  // redirect to Form-builder page with a reaload
  const openFormBuilder = (id) => {
    window.location.replace(
      `${window.MRM_Vars.admin_url}admin.php?page=mrm-admin#/form-builder/${id}`
    );
    window.location.reload();
  };

  // function to sort by title ascending or default descending
  const handleSort = (param, name) => {
    setSortBy(name);
    if ("title" === param) {
      setSortByType("ASC");
    } else {
      setSortByType("DESC");
    }
    setToggleDropdown(false);
  };

  // function for copying shortcode from the input field
  const handleCopyShortcode = (formId) => {
    var copyText = document.getElementById("shortcode-" + formId);
    copyText.select();
    //deprecated - can be changed with notification.clipboard (only for trusted sites)
    document.execCommand("copy");

    AddSuccessNotification({
      message: setMessage("Shortcode copied ! "),
      event: setShowNotification,
    });
  };

  // handler for one single item click
  const handleSelectOne = (e) => {
    if (selected.includes(e.target.id)) {
      // already in selected list so remove it from the array
      setSelected(selected.filter((element) => element != e.target.id));
      // corner case where one item is deselected so hide all checked
      setAllSelected(false);
    } else {
      // add id to the array
      setSelected([...selected, e.target.id]);
    }
  };

  // handler for all item click
  const handleSelectAll = (e) => {
    if (allSelected) {
      setSelected([]);
    } else {
      setSelected(formData?.map((form) => form.id));
    }
    setAllSelected(!allSelected);
  };

  // handle to shrink the title if it's greater than 25 character
  const handleTitleShrink = (title) => {
    if (26 > title.length) {
      return title;
    } else {
      return title.slice(0, 25) + "...";
    }
  };

  /*
   * Render method
   */

  return (
    <div>
      <div className="form-list-page">
        <div className="contact-list-page form-list">
          <div className="mintmrm-container">
            <div className="form-title-header">
              <div className="left-section">
                <h2>Forms</h2>
              </div>

              <div className="right-section">
                <button
                  className="add-form-btn mintmrm-btn"
                  onClick={redirectFormBuilder}
                >
                  <Plus /> Add Form
                </button>
              </div>
            </div>

            <div className="contact-list-area">
              <div className="contact-list-header">
                <div className="sorting">
                  <h5>Sort by</h5>
                  <div
                    className={
                      toggleDropdown ? "pos-relative show" : "pos-relative"
                    }
                  >
                    <button onClick={() => setToggleDropdown(!toggleDropdown)}>
                      {sortBy}
                    </button>

                    <ul className="mintmrm-dropdown">
                      <li onClick={() => handleSort("created-at", "Date")}>
                        Date
                      </li>
                      <li onClick={() => handleSort("title", "Title")}>
                        Title
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="right-buttons">
                  <span className="search-section">
                    <Search />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={search}
                      onChange={(e) => {
                        let value = e.target.value;
                        setSearch(value);
                        // only set query when there are more than 1 characters
                        if (value.length >= 1) {
                          setQuery(`&search=${value}`);
                          // on every new search term set the page explicitly to 1 so that results can
                          // appear
                          setPage(1);
                        } else {
                          setQuery("");
                        }
                      }}
                    />
                  </span>

                  <div className="bulk-action">
                    {/* show more options section */}
                    <button
                      className="more-option"
                      onClick={() => setShowMoreOptions(!showMoreOptions)}
                      ref={threeDotRef}
                    >
                      <ThreeDotIcon />

                      <ul
                        className={
                          showMoreOptions
                            ? "select-option mintmrm-dropdown show "
                            : "select-option mintmrm-dropdown"
                        }
                      >
                        <li onClick={deleteMultipleList}>
                          <Delete /> Delete Selected
                        </li>
                      </ul>
                    </button>
                  </div>
                </div>
              </div>

              {loading ? (
                <LoadingIndicator type="table" />
              ) : (
                <div className="contact-list-body">
                  <div class="contact-list-table">
                    <table>
                      <thead>
                        <tr>
                          <th className="form-name">
                            <span class="mintmrm-checkbox no-title">
                              <input
                                type="checkbox"
                                name="bulk-select"
                                id="bulk-select"
                                onChange={handleSelectAll}
                                checked={allSelected}
                              />
                              <label for="bulk-select">Forms Name</label>
                            </span>
                          </th>
                          {/* <th className="view">View</th> */}
                          <th className="entries">Entries</th>
                          <th className="shortcode">Shortcode</th>
                          <th className="status">Status</th>
                        </tr>
                      </thead>

                      <tbody>
                        {formData?.length > 0 ? (
                          formData.map((form) => {
                            return (
                              <tr key={form.id}>
                                <td className="form-name">
                                  <div class="name-checkbox">
                                    <span class="mintmrm-checkbox no-title">
                                      <input
                                        type="checkbox"
                                        name={form.id}
                                        id={form.id}
                                        onChange={handleSelectOne}
                                        checked={selected.includes(form.id)}
                                      />
                                      <label for={form.id}></label>
                                    </span>

                                    <div className="name-wrapper">
                                      <span className="icon">
                                        <FormIconSM />
                                      </span>

                                      <span className="name">
                                        <a
                                          onClick={() =>
                                            openFormBuilder(form.id)
                                          }
                                        >
                                          {handleTitleShrink(form.title)}
                                        </a>

                                        <small>{form.created_ago} ago</small>
                                      </span>
                                    </div>
                                  </div>
                                </td>

                                {/* <td className="view">453</td> */}

                                <td className="entries">
                                  {form.meta_fields?.entries
                                    ? form.meta_fields?.entries
                                    : 0}
                                </td>

                                <td className="shortcode">
                                  <span id="myTooltip"></span>
                                  <div className="shortcode-wrapper">
                                    <input
                                      type="text"
                                      value={'[mintmrm id="' + form.id + '"]'}
                                      id={"shortcode-" + form.id}
                                      readOnly
                                    />
                                    <button
                                      type="button"
                                      className="copy"
                                      id={"copybtn-" + form.id}
                                      onClick={() =>
                                        handleCopyShortcode(form.id)
                                      }
                                    >
                                      <CopyIcon />
                                    </button>
                                  </div>
                                </td>

                                <td className="status">
                                  <span className="mintmrm-switcher">
                                    <input
                                      checked={form.status === "published"}
                                      type="checkbox"
                                      name="checkedB"
                                      id={"st-" + form.id}
                                      onChange={statusSwitch}
                                    />
                                    <label htmlFor={"st-" + form.id}></label>
                                  </span>
                                </td>

                                <td className="action">
                                  <button
                                    className="more-option"
                                    onClick={() => {
                                      setCurrentActive((prevActive) => {
                                        // if current list item is already active then hide the overlay menu by setting current active to 0
                                        if (prevActive == form.id) {
                                          return 0;
                                        } else {
                                          // show current active as ususal
                                          return form.id;
                                        }
                                      });
                                    }}
                                  >
                                    <ThreeDotIcon />

                                    {currentActive == form.id && ( // only show the menu if both active and current active points to this listitem
                                      <ul
                                        className={
                                          currentActive == form.id
                                            ? "mintmrm-dropdown show"
                                            : "mintmrm-dropdown"
                                        }
                                      >
                                        <li
                                          className="action-list"
                                          style={{ display: "flex" }}
                                          onClick={() =>
                                            openFormBuilder(form.id)
                                          }
                                        >
                                          <EditIcon />
                                          Edit
                                        </li>
                                        <li
                                          className="action-list"
                                          onClick={() => deleteForm(form.id)}
                                        >
                                          <Delete />
                                          Delete
                                        </li>
                                      </ul>
                                    )}
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr className="no-data">
                            <td colSpan={6}>
                              <FormIconXL />
                              <h5>No Form(s) Found</h5>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              {totalPages > 1 && (
                <div className="contact-list-footer">
                  <Pagination
                    currentPage={page}
                    pageSize={perPage}
                    onPageChange={setPage}
                    totalCount={count}
                    totalPages={totalPages}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mintmrm-container" style={{ display: isDelete }}>
          <DeletePopup
            title={deleteTitle}
            message={deleteMessage}
            onDeleteShow={onDeleteShow}
            onDeleteStatus={onDeleteStatus}
            onMultiDelete={onMultiDelete}
            selected={selected}
          />
        </div>
        <div className="mintmrm-container" style={{ display: showAlert }}>
          <AlertPopup showAlert={showAlert} onShowAlert={onShowAlert} />
        </div>
        <SuccessfulNotification
          display={showNotification}
          setShowNotification={setShowNotification}
          message={message}
          notificationType={notificationType}
          setNotificationType={setNotificationType}
        />
      </div>

      <FormTemplate
        isOpen={isTemplate}
        isClose={isClose}
        isNewCampaign={true}
        setIsClose={setIsClose}
        setIsTemplate={setIsTemplate}
      />
    </div>
  );
}
