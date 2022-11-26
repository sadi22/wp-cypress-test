import queryString from "query-string";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
// Internal dependencies
import AlertPopup from "../../components/AlertPopup";
import ContactCards from "../../components/ContactCards/index";
import ContactNavbar from "../../components/ContactNavbar/index";
import CustomSelect from "../../components/CustomSelect/CustomSelect";
import DeletePopup from "../../components/DeletePopup";
import ExportDrawer from "../../components/ExportDrawer";
import ContactProfile from "../../components/Icons/ContactProfile";
import CrossIcon from "../../components/Icons/CrossIcon";
import NoContactIcon from "../../components/Icons/NoContactIcon";
import Pending from "../../components/Icons/Pending";
import PlusCircleIcon from "../../components/Icons/PlusCircleIcon";
import Search from "../../components/Icons/Search";
import Subscribe from "../../components/Icons/Subscribe";
import ThreeDotIcon from "../../components/Icons/ThreeDotIcon";
import Unsubscribe from "../../components/Icons/Unsubscribe";
import ListenForOutsideClicks, {
  useOutsideAlerter,
} from "../../components/ListenForOutsideClicks";
import LoadingIndicator from "../../components/LoadingIndicator";
import Pagination from "../../components/Pagination";
import SuccessfulNotification from "../../components/SuccessfulNotification";
import { useGlobalStore } from "../../hooks/useGlobalStore";
import {
  deleteMultipleContactsItems,
  deleteSingleContact,
} from "../../services/Contact";
import { ClearNotification } from "../../utils/admin-notification";
import AssignedItems from "./AssignedItems";
import ColumnList from "./ColumnList";
import SingleContact from "./SingleContact";

export default function ContactListTable() {
  const [isLists, setIsLists] = useState(false);
  const [isTags, setIsTags] = useState(false);
  const [isStatus, setIsStatus] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [countGroups, setCountGroups] = useState([]);
  const [filterPerPage, setFilterPerPage] = useState(10);
  const [filterPage, setFilterPage] = useState(1);
  const [filterCount, setFilterCount] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isAddColumn, setIsAddColumn] = useState(false);
  const [isAssignTo, setIsAssignTo] = useState(false);
  const [contactData, setContactData] = useState([]);
  const [search, setSearch] = useState("");
  const [searchColumns, setSearchColumns] = useState("");
  const [filterSearch, setFilterSearch] = useState("");
  // search query, search query only updates when there are more than 3 characters typed
  const [query, setQuery] = useState("");

  const [lists, setLists] = useState([]);
  const [tags, setTags] = useState([]);

  const [filterData, setFilterData] = useState({});

  const navigate = useNavigate();
  // the select all checkbox
  const [allSelected, setAllSelected] = useState(false);

  // single selected array which holds selected ids with
  const [selected, setSelected] = useState([]);

  const [totalPages, setTotalPages] = useState(0);
  const [filterTotalPages, setFilterTotalPages] = useState(0);
  const [currentActive, setCurrentActive] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilter, setIsFilter] = useState(false);

  const location = useLocation();
  const [filterRequest, setFilterRequest] = useState({});
  // global counter update real time
  const counterRefresh = useGlobalStore((state) => state.counterRefresh);
  const [showNotification, setShowNotification] = useState("none");
  const [notificationType, setNotificationType] = useState("success");
  const [message, setMessage] = useState("");
  const [contactId, setContactId] = useState();
  const [refresh, setRefresh] = useState();
  // Prepare filter object
  const [filterAdder, setFilterAdder] = useState({
    lists: [],
    tags: [],
    status: [],
  });

  const [isNoteForm, setIsNoteForm] = useState(true);
  const [isCloseNote, setIsCloseNote] = useState(true);
  const [showAlert, setShowAlert] = useState("none");
  const [isDelete, setIsDelete] = useState("none");
  const [deleteTitle, setDeleteTitle] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");
  const [assignLists, setAssignLists] = useState([]);
  const [assignTags, setAssignTags] = useState([]);
  const [selectGroup, setSelectGroup] = useState("lists");

  const [selectedLists, setSelectedLists] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [filteredStatus, setFilteredStatus] = useState([]);
  const [filteredLists, setFilteredLists] = useState([]);
  const [filteredTags, setFilteredTags] = useState([]);
  const [listColumns, setListColumns] = useState([]);
  const [columns, setColumns] = useState([]);
  const [countData, setCountData] = useState([]);
  const [listening, setListening] = useState(false);

  // Outside click events for add column checkbox dropdown
  const addColumnRef = useRef(null);
  useOutsideAlerter(addColumnRef, setIsAddColumn);

  // Outside click events for bulk action dropdown
  const threedotRef = useRef(null);
  useEffect(
    ListenForOutsideClicks(listening, setListening, threedotRef, setIsActive)
  );

  const filteredColumns = useMemo(() => {
    if (searchColumns) {
      return listColumns.filter(
        (item) =>
          item.value.toLowerCase().indexOf(searchColumns.toLocaleLowerCase()) >
          -1
      );
    }
    return listColumns;
  }, [searchColumns, listColumns]);

  const deleteAll = () => {
    setSelectedLists([]);
    setSelectedTags([]);
    setSelectedStatus([]);
    setFilterRequest({});
    setFilterData({});
    setFilterAdder({
      lists: [],
      tags: [],
      status: [],
    });
    navigate("/contacts");
  };

  useEffect(() => {
    setSearchParams(filterAdder);
  }, [filterAdder]);

  useEffect(() => {
    setFilterData(queryString.parse(location.search));
    navigate(`${location.pathname}${location.search}`);
  }, [searchParams]);

  useEffect(() => {
    let tags_array = [];
    let lists_array = [];
    let status_array = [];

    tags_array =
      "string" == typeof filterData.tags
        ? filterData.tags.split(" ")
        : filterData.tags;

    lists_array =
      "string" == typeof filterData.lists
        ? filterData.lists.split(" ")
        : filterData.lists;

    status_array =
      "string" == typeof filterData.status
        ? filterData.status.split(" ")
        : filterData.status;

    setFilterRequest({
      tags_ids: tags_array,
      lists_ids: lists_array,
      status: status_array,
    });

    filterData.status ? setFilteredStatus(filterData.status) : "";
    filterData.tags ? setFilteredTags(filterData.tags) : "";
    filterData.lists ? setFilteredLists(filterData.lists) : "";
    setFilterPage(1);
  }, [filterData]);

  useEffect(() => {
    const getFilter = async () => {
      setShowLoader(true);
      return fetch(
        `${window.MRM_Vars.api_base_url}mrm/v1/contacts/filter?search=${filterSearch}&page=${filterPage}&per-page=${filterPerPage}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(filterRequest),
        }
      )
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
        })
        .then((data) => {
          if (200 == data.code) {
            setContactData(data.data.data);
            setFilterCount(data.data.count);
            setFilterTotalPages(data.data.total_pages);
            setShowLoader(false);
          }
        });
    };

    if (
      filterRequest.tags_ids != undefined ||
      filterRequest.lists_ids != undefined ||
      filterRequest.status != undefined
    ) {
      getFilter();
      setIsFilter(true);
    } else {
      setIsFilter(false);
    }
  }, [filterRequest, filterPage, filterSearch]);

  useEffect(() => {
    async function getData() {
      setShowLoader(true);
      await fetch(
        `${window.MRM_Vars.api_base_url}mrm/v1/contacts?page=${page}&per-page=${perPage}${query}`
      )
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
        })
        .then((data) => {
          if (200 == data.code) {
            setCountData(data.data.count_status);
            setContactData(data.data.data);
            setCount(data.data.total_count);
            setTotalPages(data.data.total_pages);
            setCountGroups(data.data.count_groups);
            setShowLoader(false);
          }
        });
    }

    if (false == isFilter) getData();

    if ("contact-created" == location.state?.status) {
      setNotificationType("success");
      setShowNotification("block");
      setMessage(location.state?.message);
    }

    ClearNotification("none", setShowNotification);
  }, [perPage, page, query, refresh, isFilter]);

  useEffect(() => {
    async function getColumns() {
      await fetch(`${window.MRM_Vars.api_base_url}mrm/v1/columns`)
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
        })
        .then((data) => {
          if (200 == data.code) {
            setListColumns(data.data);
          }
        });
    }

    getColumns();
    getStoredColumns();
  }, []);

  const toggleRefresh = () => {
    setRefresh((prev) => !prev);
  };

  async function getStoredColumns() {
    await fetch(`${window.MRM_Vars.api_base_url}mrm/v1/columns/stored`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        if (200 == data.code) {
          setColumns(data.data);
        }
      });
  }

  const showMoreOption = () => {
    setIsActive(!isActive);
    setIsAssignTo(false);
  };

  // Get contact id from child component for delete
  const deleteContact = async (contact_id) => {
    setIsDelete("block");
    setContactId(contact_id);
    setDeleteTitle("Contact Delete");
    setDeleteMessage("Are you sure you want to delete the contact?");
  };

  // Delete contact after delete confirmation
  const onDeleteStatus = async (status) => {
    if (status) {
      deleteSingleContact(contactId).then((result) => {
        if (200 === result.code) {
          setShowNotification("block");
          setMessage(result.message);
          toggleRefresh();
          useGlobalStore.setState({
            counterRefresh: !counterRefresh,
          });
        } else {
          setErrors({
            ...errors,
            title: result?.message,
          });
        }
      });
    }
    setIsDelete("none");
    ClearNotification("none", setShowNotification);
  };

  async function deleteMultipleContacts() {
    if (selected.length > 0) {
      setIsDelete("block");
      setDeleteTitle("Delete Multiple");
      setDeleteMessage("Are you sure you want to delete these selected items?");
    } else {
      setShowAlert("block");
    }
    setIsActive(false);
  }

  // Delete multiple contacts after delete confirmation
  const onMultiDelete = async (status) => {
    if (status) {
      deleteMultipleContactsItems(selected).then((response) => {
        if (200 === response.code) {
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

  // Hide alert popup after click on ok
  const onShowAlert = async (status) => {
    setShowAlert(status);
  };

  // Hide delete popup after click on cancel
  const onDeleteShow = async (status) => {
    setIsDelete(status);
  };

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

  const handleSelectAll = (e) => {
    if (allSelected) {
      setSelected([]);
    } else {
      setSelected(contactData.map((contact) => contact.id));
    }
    setAllSelected(!allSelected);
  };
  const showLists = (event) => {
    event.stopPropagation();
    setIsLists(!isLists);
    setIsTags(false);
    setIsStatus(false);
  };
  const showTags = (event) => {
    event.stopPropagation();
    setIsTags(!isTags);
    setIsLists(false);
    setIsStatus(false);
  };
  const showStatus = (event) => {
    event.stopPropagation();
    setIsStatus(!isStatus);
    setIsTags(false);
    setIsLists(false);
  };

  const showListDropdown = () => {
    if (!selected.length) {
      setShowAlert("block");
    } else {
      setSelectGroup("lists");
      setIsAssignTo(!isAssignTo);
      setIsActive(!isActive);
    }
    setIsActive(false);
  };

  const showTagDropdown = () => {
    if (!selected.length) {
      setShowAlert("block");
    } else {
      setSelectGroup("tags");
      setIsAssignTo(!isAssignTo);
      setIsActive(!isActive);
    }

    setIsActive(false);
  };

  const showAddColumnList = () => {
    setIsAddColumn(!isAddColumn);
  };

  const hideAddColumnList = () => {
    setIsAddColumn(!isAddColumn);
  };

  const noteForm = () => {
    setIsNoteForm(true);
    setIsCloseNote(!isCloseNote);
  };

  const deleteSelectedlist = (e, id) => {
    const index = selectedLists.findIndex((item) => item.id == id);

    // already in selected list so remove it from the array
    if (0 <= index) {
      setSelectedLists(selectedLists.filter((item) => item.id != id));
      setFilterAdder((prev) => ({
        ...prev,
        lists: prev.lists.filter((item) => {
          return item != id;
        }),
      }));
      // setFilterAdder(filterAdder.lists.filter((item) => item != id));
    }
  };
  const deleteSelectedtag = (e, id) => {
    const index = selectedTags.findIndex((item) => item.id == id);

    // already in selected list so remove it from the array
    if (0 <= index) {
      setSelectedTags(selectedTags.filter((item) => item.id != id));
      setFilterAdder((prev) => ({
        ...prev,
        tags: prev.tags.filter((item) => {
          return item != id;
        }),
      }));
    }
  };
  const deleteSelectedstatus = (e, id) => {
    const index = selectedStatus.findIndex((item) => item.id == id);

    // already in selected list so remove it from the array
    if (0 <= index) {
      setSelectedStatus(selectedStatus.filter((item) => item.id != id));
      setFilterAdder((prev) => ({
        ...prev,
        status: prev.status.filter((item) => {
          return item != id;
        }),
      }));
    }
  };

  const saveColumnList = async () => {
    const res = await fetch(`${window.MRM_Vars.api_base_url}mrm/v1/columns/`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        contact_columns: columns,
      }),
    });
    const responseData = await res.json();
    const code = responseData?.code;
    if (code === 201) {
      setShowNotification("block");
      setMessage(responseData?.message);
      setColumns(responseData.data);
      // setIsAddColumn(!isAddColumn);
      toggleRefresh();
    } else {
      // Validation messages
      setErrors({
        ...errors,
        email: responseData?.message,
      });
    }
  };

  return (
    <>
      <ContactNavbar countGroups={countGroups} />
      <div className="contact-list-page">
        <div className="mintmrm-container">
          <div className="contact-info-wrapper">
            <ContactCards
              source={<ContactProfile />}
              url="#"
              cardTitle="Total Contacts"
              totalAmount={count}
            />
            <ContactCards
              source={<Subscribe />}
              url="#"
              cardTitle="Subscribed"
              totalAmount={countData.subscribed}
            />
            <ContactCards
              source={<Unsubscribe />}
              url="#"
              cardTitle="Unsubscribed"
              totalAmount={countData.unsubscribed}
            />
            <ContactCards
              source={<Pending />}
              url="#"
              cardTitle="Pending"
              totalAmount={countData.pending}
            />
          </div>

          <div className="contact-list-area">
            <div className="contact-list-body">
              <div className="contact-list-header">
                <div className="left-filters filter-box">
                  <div className="form-group left-filter">
                    <CustomSelect
                      selected={selectedLists}
                      setSelected={setSelectedLists}
                      endpoint="/lists"
                      placeholder="Lists"
                      name="lists"
                      listTitle="CHOOSE LIST"
                      listTitleOnNotFound="No Data Found"
                      searchPlaceHolder="Search..."
                      allowMultiple={true}
                      showSearchBar={true}
                      showListTitle={true}
                      showSelectedInside={false}
                      allowNewCreate={true}
                      setFilterAdder={setFilterAdder}
                      filterAdder={filterAdder}
                      filterRequest={filterRequest}
                      prefix="filter"
                    />
                  </div>
                  <div className="form-group left-filter">
                    <CustomSelect
                      selected={selectedTags}
                      setSelected={setSelectedTags}
                      endpoint="/tags"
                      placeholder="Tags"
                      name="tags"
                      listTitle="CHOOSE TAG"
                      listTitleOnNotFound="No Data Found"
                      searchPlaceHolder="Search..."
                      allowMultiple={true}
                      showSearchBar={true}
                      showListTitle={true}
                      showSelectedInside={false}
                      allowNewCreate={true}
                      setFilterAdder={setFilterAdder}
                      filterAdder={filterAdder}
                      filterRequest={filterRequest}
                      prefix="filter"
                    />
                  </div>
                  <div className="form-group left-filter">
                    <CustomSelect
                      selected={selectedStatus}
                      setSelected={setSelectedStatus}
                      endpoint="/status"
                      placeholder="Status"
                      name="status"
                      listTitle="CHOOSE Status"
                      listTitleOnNotFound="No Data Found"
                      searchPlaceHolder="Search..."
                      allowMultiple={true}
                      showSearchBar={true}
                      showListTitle={true}
                      showSelectedInside={false}
                      allowNewCreate={true}
                      setFilterAdder={setFilterAdder}
                      filterAdder={filterAdder}
                      filterRequest={filterRequest}
                      prefix="filter"
                    />
                  </div>
                </div>

                <div className="right-buttons">
                  <span className="search-section">
                    <Search />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => {
                        let value = e.target.value;
                        setSearch(value);
                        setFilterSearch(value);
                        // only set query when there are more than 3 characters
                        if (value.length >= 1) {
                          setQuery(encodeURI(`&search=${value}`));
                          // on every new search term set the page explicitly to 1 so that results can
                          // appear
                          setPage(1);
                        } else {
                          setQuery("");
                        }
                      }}
                      placeholder="Search..."
                    />
                  </span>

                  {/* <button className="export-btn mintmrm-btn outline" onClick={noteForm}>
            <ExportIcon />
            Export
          </button> */}
                  <ExportDrawer
                    isOpenNote={isNoteForm}
                    isCloseNote={isCloseNote}
                    setIsCloseNote={setIsCloseNote}
                  />

                  <div className="bulk-action" ref={threedotRef}>
                    <button className="more-option" onClick={showMoreOption}>
                      <ThreeDotIcon />
                    </button>
                    <ul
                      className={
                        isActive
                          ? "select-option mintmrm-dropdown show"
                          : "select-option mintmrm-dropdown"
                      }
                    >
                      <li onClick={showListDropdown}>Assign to list</li>
                      <li onClick={showTagDropdown}>Assign to tag</li>
                      {/* <li onClick={showListDropdown}>Assign to segment</li> */}
                      <li className="delete" onClick={deleteMultipleContacts}>
                        Delete
                      </li>
                    </ul>
                    {"lists" == selectGroup ? (
                      <AssignedItems
                        selected={assignLists}
                        setSelected={setAssignLists}
                        endpoint="lists"
                        placeholder="Lists"
                        name="list"
                        listTitle="CHOOSE LIST"
                        listTitleOnNotFound="No Data Found"
                        searchPlaceHolder="Search..."
                        allowMultiple={true}
                        showSearchBar={true}
                        showListTitle={true}
                        showSelectedInside={false}
                        allowNewCreate={true}
                        isAssignDropdown={isActive}
                        setIsAssignDropdown={setIsActive}
                        isActive={isAssignTo}
                        setIsActive={setIsAssignTo}
                        contactIds={selected}
                        refresh={refresh}
                        setRefresh={setRefresh}
                        setShowNotification={setShowNotification}
                        showNotification={"mone"}
                        setMessage={setMessage}
                        message={message}
                        prefix="assign"
                      />
                    ) : (
                      <AssignedItems
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
                        isActive={isAssignTo}
                        setIsActive={setIsAssignTo}
                        contactIds={selected}
                        refresh={refresh}
                        setRefresh={setRefresh}
                        setShowNotification={setShowNotification}
                        showNotification={"mone"}
                        setMessage={setMessage}
                        message={message}
                        prefix="assign"
                      />
                    )}
                  </div>
                </div>
              </div>

              <div
                className={
                  selectedLists.length == 0 &&
                  selectedTags.length == 0 &&
                  selectedStatus.length == 0
                    ? "selected-result inactive"
                    : "selected-result"
                }
              >
                {selectedLists.map((item) => {
                  return (
                    <span key={item.id} className="mrm-custom-selected-items">
                      {item.title}
                      <div
                        className="cross-icon"
                        onClick={(e) => deleteSelectedlist(e, item.id)}
                      >
                        <CrossIcon />
                      </div>
                    </span>
                  );
                })}
                {selectedTags.map((item) => {
                  return (
                    <span key={item.id} className="mrm-custom-selected-items">
                      {item.title}
                      <div
                        className="cross-icon"
                        onClick={(e) => deleteSelectedtag(e, item.id)}
                      >
                        <CrossIcon />
                      </div>
                    </span>
                  );
                })}
                {selectedStatus.map((item) => {
                  return (
                    <span key={item.id} className="mrm-custom-selected-items">
                      {item.title}
                      <div
                        className="cross-icon"
                        onClick={(e) => deleteSelectedstatus(e, item.id)}
                      >
                        <CrossIcon />
                      </div>
                    </span>
                  );
                })}
                <div className="clear-all" onClick={deleteAll}>
                  <span>Clear All</span>
                </div>
              </div>

              {showLoader ? (
                <LoadingIndicator type="table" />
              ) : (
                <>
                  <div className="pos-relative">
                    <div className="add-column" ref={addColumnRef}>
                      <button
                        className="add-column-btn"
                        onClick={showAddColumnList}
                      >
                        <PlusCircleIcon />
                        <span className="tooltip">Add Column</span>
                      </button>
                      <ul
                        className={
                          isAddColumn
                            ? "mintmrm-dropdown show"
                            : "mintmrm-dropdown"
                        }
                      >
                        <li className="searchbar">
                          <span class="pos-relative">
                            <Search />
                            <input
                              type="search"
                              name="column-search"
                              placeholder="Search..."
                              value={searchColumns}
                              onChange={(e) => setSearchColumns(e.target.value)}
                            />
                          </span>
                        </li>

                        <li className="list-title">Choose columns</li>

                        {filteredColumns.length > 0 ? (
                          filteredColumns &&
                          filteredColumns.map((column) => {
                            return (
                              <li className="single-column" key={column.id}>
                                <ColumnList
                                  title={column.value}
                                  id={column.id}
                                  selected={columns}
                                  setSelected={setColumns}
                                />
                              </li>
                            );
                          })
                        ) : (
                          <div>No Column Found</div>
                        )}

                        <li className="button-area">
                          {/* <button className="mintmrm-btn outline default-btn">
                Default
              </button> */}
                          <button
                            className="mintmrm-btn outline cancel-btn"
                            onClick={hideAddColumnList}
                          >
                            Cancel
                          </button>
                          <button
                            className="mintmrm-btn save-btn"
                            onClick={saveColumnList}
                          >
                            Save
                          </button>
                        </li>
                      </ul>
                    </div>
                    <div className="contact-list-table">
                      <table>
                        <thead>
                          <tr>
                            <th className="email">
                              <span class="mintmrm-checkbox">
                                <input
                                  type="checkbox"
                                  name="bulk-select"
                                  id="bulk-select"
                                  onChange={handleSelectAll}
                                  checked={allSelected}
                                />
                                <label for="bulk-select">Email</label>
                              </span>
                            </th>

                            <th className="first-name">First Name</th>

                            <th className="last-name">Last Name</th>
                            <th className="list">Lists</th>
                            <th className="tag">Tags</th>
                            <th className="status">Status</th>

                            {columns?.map((column) => {
                              return (
                                <th key={column.id} className={column.id}>
                                  {column.title}
                                </th>
                              );
                            })}
                            <th className="action"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {!contactData?.length && (
                            <tr>
                              <td
                                className="no-contact"
                                colspan="10"
                                style={{ textAlign: "center" }}
                              >
                                <NoContactIcon />
                                No contact data found{" "}
                                {search ? `"${search}"` : null}
                              </td>
                            </tr>
                          )}

                          {contactData?.map((contact, idx) => {
                            return (
                              <SingleContact
                                key={idx}
                                contact={contact}
                                toggleRefresh={toggleRefresh}
                                currentActive={currentActive}
                                setCurrentActive={setCurrentActive}
                                handleSelectOne={handleSelectOne}
                                deleteContact={deleteContact}
                                selected={selected}
                                columns={columns}
                              />
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div>
                    {false === isFilter ? (
                      <Pagination
                        currentPage={page}
                        pageSize={perPage}
                        onPageChange={setPage}
                        totalCount={count}
                        totalPages={totalPages}
                      />
                    ) : (
                      <Pagination
                        currentPage={filterPage}
                        pageSize={filterPerPage}
                        onPageChange={setFilterPage}
                        totalCount={filterCount}
                        totalPages={filterTotalPages}
                      />
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mintmrm-container" style={{ display: showAlert }}>
        <AlertPopup showAlert={showAlert} onShowAlert={onShowAlert} />
      </div>
      <div className="mintmrm-container" style={{ display: isDelete }}>
        <DeletePopup
          title={deleteTitle}
          message={deleteMessage}
          onDeleteShow={onDeleteShow}
          onMultiDelete={onMultiDelete}
          selected={selected}
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
