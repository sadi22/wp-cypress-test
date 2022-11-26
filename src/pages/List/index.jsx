import React, { useEffect, useRef, useState } from "react";
import AlertPopup from "../../components/AlertPopup";
import ContactNavbar from "../../components/ContactNavbar";
import DeletePopup from "../../components/DeletePopup";
import Delete from "../../components/Icons/Delete";
import ListIcon from "../../components/Icons/ListIcon";
import Search from "../../components/Icons/Search";
import ThreeDotIcon from "../../components/Icons/ThreeDotIcon";
import ListenForOutsideClicks from "../../components/ListenForOutsideClicks";
import LoadingIndicator from "../../components/LoadingIndicator/index";
import Pagination from "../../components/Pagination";
import SuccessfulNotification from "../../components/SuccessfulNotification";
import { useGlobalStore } from "../../hooks/useGlobalStore";
import {
  deleteMultipleListsItems,
  deleteSingleList,
  submitList,
  updateList,
} from "../../services/List";
import { ClearNotification } from "../../utils/admin-notification";
import { AdminNavMenuClassChange } from "../../utils/admin-settings";
import ListItem from "./ListItem";

const Lists = () => {
  // Admin active menu selection
  AdminNavMenuClassChange("mrm-admin", "contacts");
  // showCreate shows the create form if true
  const [showCreate, setShowCreate] = useState(false);

  // global counter update real time
  const counterRefresh = useGlobalStore((state) => state.counterRefresh);

  // editID is the id of the edit page
  const [editID, setEditID] = useState(0);

  // whether to show more options or not
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  // current lists data
  const [lists, setLists] = useState([]);

  // how many to show per page
  const [perPage, setPerPage] = useState(10);

  // current page
  const [page, setPage] = useState(1);

  // order by which field
  const [orderBy, setOrderBy] = useState("title");

  // order type asc or desc
  const [orderType, setOrderType] = useState("asc");

  // total count of results
  const [count, setCount] = useState(0);

  // total number of pages for result
  const [totalPages, setTotalPages] = useState(0);

  // list values for sending to backend
  const [values, setValues] = useState({
    title: "",
    data: "",
  });

  // search input value is stored here
  const [search, setSearch] = useState("");

  // search query, search query only updates when there are more than 3 characters typed
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

  const [errors, setErrors] = useState({});

  const [showNotification, setShowNotification] = useState("none");
  const [notificationType, setNotificationType] = useState("success");
  const [message, setMessage] = useState("");
  const [isDelete, setIsDelete] = useState("none");
  const [listID, setListID] = useState();
  const [deleteTitle, setDeleteTitle] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");
  const [showAlert, setShowAlert] = useState("none");
  const [showDropdown, setShowDropdown] = useState(false);
  const [sortButtonName, setSortButtonName] = useState("Name (A - Z)");
  // loading or not
  const [loading, setLoading] = useState(false);
  const [showTableHead, setShowTableHead] = useState(false);
  const [countGroups, setCountGroups] = useState([]);
  const [listening, setListening] = useState(false);

  const sortByRef = useRef(null);
  const moreOptionRef = useRef(null);

  useEffect(
    ListenForOutsideClicks(listening, setListening, sortByRef, setShowDropdown)
  );

  useEffect(
    ListenForOutsideClicks(
      listening,
      setListening,
      moreOptionRef,
      setShowMoreOptions
    )
  );

  // set navbar Buttons
  useGlobalStore.setState({
    navbarMarkup: (
      <button
        className="contact-save mintmrm-btn"
        onClick={() => {
          // if user is currently updating reset the fields so that add new list displays a blank form
          if (editID != 0) {
            setEditID(0);
            setValues({
              title: "",
              data: "",
            });
          } else {
            setShowCreate((prevShowCreate) => !prevShowCreate);
          }
        }}
      >
        + Add List
      </button>
    ),
    hideGlobalNav: false,
  });

  // Set values from list form
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
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
      setSelected(lists.map((list) => list.id));
    }
    setAllSelected(!allSelected);
  };

  // the data is fetched again whenver refresh is changed
  function toggleRefresh() {
    setRefresh((prev) => !prev);
  }

  // this function sets the required edit parameters
  function editList(list) {
    setEditID(list.id);
    setValues(list);
    setShowCreate(true);
  }

  // Handle list create or update form submission
  const createOrUpdate = async () => {
    let result = 0 != editID ? updateList(values) : submitList(values);

    result.then((response) => {
      if (201 === response.code) {
        setValues({
          title: "",
          data: "",
        });
        setShowCreate(false);
        setEditID(0);
        setNotificationType("success");
        setShowNotification("block");
        setMessage(response.message);
        setErrors({});
        useGlobalStore.setState({
          counterRefresh: !counterRefresh,
        });
        toggleRefresh();
      } else {
        // Error messages
        setErrors({
          ...errors,
          list: response.message,
        });
      }
    });
  };

  // Hide create form after click on cancel
  const handleCancel = () => {
    setShowCreate(false);
    setValues({
      title: "",
      data: "",
    });
    setErrors({});
  };

  // at first page load get all the available lists
  // also get lists if the page or perpage or search item changes
  useEffect(() => {
    async function getLists() {
      setLoading(true);
      const res = await fetch(
        `${window.MRM_Vars.api_base_url}mrm/v1/lists?order-by=${orderBy}&order-type=${orderType}&page=${page}&per-page=${perPage}${query}`
      );
      const resJson = await res.json();
      if (resJson.code == 200) {
        setLists(resJson.data.data);
        setCount(resJson.data.total_count);
        setTotalPages(resJson.data.total_pages);
        setCountGroups(resJson.data.count_groups);
        setLoading(false);
        setShowTableHead(true);
      }
    }
    getLists();
    ClearNotification("none", setShowNotification);
  }, [page, perPage, query, refresh, orderBy, orderType]);

  // Get field id from child component
  const deleteList = async (list_id) => {
    setIsDelete("block");
    setDeleteTitle("Delete List");
    setDeleteMessage("Are you sure you want to delete the list?");
    setListID(list_id);
    setAllSelected(false);
    setSelected([]);
    setShowMoreOptions(false);
  };

  // Delete list after delete confirmation
  const onDeleteStatus = async (status) => {
    if (status) {
      deleteSingleList(listID).then((response) => {
        if (200 === response.code) {
          setNotificationType("success");
          setShowNotification("block");
          setMessage(response.message);
          toggleRefresh();
          useGlobalStore.setState({
            counterRefresh: !counterRefresh,
          });
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

  // Delete multiple lists after delete confirmation
  const onMultiDelete = async (status) => {
    if (status) {
      deleteMultipleListsItems(selected).then((response) => {
        if (200 === response.code) {
          setNotificationType("success");
          setShowNotification("block");
          setMessage(response.message);
          toggleRefresh();
          setAllSelected(false);
          setSelected([]);
          useGlobalStore.setState({
            counterRefresh: !counterRefresh,
          });
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

  // Hide delete popup after click on cancel
  const onDeleteShow = async (status) => {
    setIsDelete(status);
  };

  // Hide alert popup after click on ok
  const onShowAlert = async (status) => {
    setShowAlert(status);
  };
  const handleDropdown = () => {
    setShowDropdown(!showDropdown);
  };
  const handleSelect = (event, order_by, order_type) => {
    setShowDropdown(false);
    setOrderBy(order_by);
    setOrderType(order_type);
    if (order_by == "title" && order_type == "asc") {
      setSortButtonName("Name (A - Z)");
    } else if (order_by == "title" && order_type == "desc") {
      setSortButtonName("Name (Z - A)");
    } else if (order_by == "created_at" && order_type == "asc") {
      setSortButtonName("Date Created Asc");
    } else {
      setSortButtonName("Date Created Desc");
    }
  };

  return (
    <>
      <ContactNavbar countGroups={countGroups} />
      {showCreate && (
        <div className="tag-contact">
          <div className="mintmrm-container">
            <h2 className="conatct-heading">
              {editID == 0 ? "Add List" : "Update List"}
            </h2>

            <div>
              <div className="add-contact-form">
                <div className="contact-form-body">
                  <div className="form-group contact-input-field">
                    <label htmlFor="title" aria-required>
                      List Name
                      <span>*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={values["title"]}
                      onChange={handleChange}
                    />
                    <p
                      className={
                        errors ? "error-message show" : "error-message"
                      }
                    >
                      {errors?.list}
                    </p>
                  </div>
                  <div className="form-group contact-input-field">
                    <label htmlFor="data" aria-required>
                      Description
                    </label>
                    <input
                      type="text"
                      name="data"
                      value={values["data"]}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="contact-button-field">
                    <button
                      className="import-cancel mintmrm-btn outline"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="import-save mintmrm-btn"
                      onClick={createOrUpdate}
                    >
                      {editID == 0 ? "Save" : "Update"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="contact-list-page lists-page">
        <div className="mintmrm-container">
          <div className="contact-list-area">
            <div className="contact-list-header">
              <div className="left-filters">
                <p className="sort-by">Sort by</p>
                <div className="sort-by-dropdown" ref={sortByRef}>
                  <button
                    className={
                      showDropdown
                        ? "drop-down-button show"
                        : "drop-down-button"
                    }
                    onClick={handleDropdown}
                  >
                    {sortButtonName}
                  </button>
                  <ul
                    className={
                      showDropdown
                        ? "mintmrm-dropdown show"
                        : "mintmrm-dropdown"
                    }
                  >
                    <li
                      onClick={(event) => handleSelect(event, "title", "asc")}
                    >
                      Name (A - Z)
                    </li>
                    <li
                      onClick={(event) => handleSelect(event, "title", "desc")}
                    >
                      Name (Z - A)
                    </li>
                    {/* <li
                      onClick={(event) =>
                        handleSelect(event, "created_at", "asc")
                      }
                    >
                      Date Created Asc
                    </li>
                    <li
                      onClick={(event) =>
                        handleSelect(event, "created_at", "desc")
                      }
                    >
                      Date Created Desc
                    </li> */}
                  </ul>
                </div>
              </div>
              <div className="right-buttons">
                {/* search input */}
                <span className="search-section">
                  <Search />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => {
                      let value = e.target.value;
                      setSearch(value);
                      // only set query when there are more than 3 characters
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
                <div className="bulk-action" ref={moreOptionRef}>
                  {/* show more options section */}
                  <button
                    className="more-option"
                    onClick={() => setShowMoreOptions(!showMoreOptions)}
                  >
                    <ThreeDotIcon />

                    <ul
                      className={
                        showMoreOptions
                          ? "select-option mintmrm-dropdown show"
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
              <>
                <div className="contact-list-body">
                  <div class="contact-list-table">
                    <table>
                      <thead
                        className={
                          showTableHead ? "showTableHead show" : "showTableHead"
                        }
                      >
                        <tr>
                          <th className="">
                            <span class="mintmrm-checkbox no-title">
                              <input
                                type="checkbox"
                                name="bulk-select"
                                id="bulk-select"
                                onChange={handleSelectAll}
                                checked={allSelected}
                              />
                              <label for="bulk-select">Name</label>
                            </span>
                          </th>
                          <th>Contacts</th>
                          <th className="">Description</th>
                          <th className="creation-date">Creation Date</th>
                          <th className="action"></th>
                        </tr>
                      </thead>

                      <tbody>
                        {/* List empty or search not found ui */}
                        {!lists.length && (
                          <tr>
                            <td
                              className="no-contact"
                              colspan="10"
                              style={{ textAlign: "center" }}
                            >
                              <ListIcon />
                              No List Found {search ? `"${search}"` : null}
                            </td>
                          </tr>
                        )}

                        {lists.map((list, idx) => {
                          return (
                            <ListItem
                              key={idx}
                              list={list}
                              deleteList={deleteList}
                              currentActive={currentActive}
                              setCurrentActive={setCurrentActive}
                              handleSelectOne={handleSelectOne}
                              selected={selected}
                              editList={editList}
                            />
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div>
                  <Pagination
                    currentPage={page}
                    pageSize={perPage}
                    onPageChange={setPage}
                    totalCount={count}
                    totalPages={totalPages}
                  />
                </div>
              </>
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
    </>
  );
};

export default Lists;
