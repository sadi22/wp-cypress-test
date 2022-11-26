import { createNewGroup } from "../../services/Common";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ClearNotification } from "../../utils/admin-notification";
import Plus from "../Icons/Plus";
import Search from "../Icons/Search";
import LoadingIndicator from "../LoadingIndicator";
import SuccessfulNotification from "../SuccessfulNotification";
export default function AddItems(props) {
  const {
    selected,
    setSelected,
    endpoint = "lists",
    placeholder = "Lists",
    options = null,
    name = "list", // used inside the new button of
    listTitle = "CHOOSE LIST",
    allowMultiple = true,
    allowNewCreate = true,
    contactId,
  } = props;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [showNotification, setShowNotification] = useState("none");
  const [notificationType, setNotificationType] = useState("success");

  useEffect(() => {
    async function getItems() {
      setLoading(true);
      const res = await fetch(
        `${window.MRM_Vars.api_base_url}mrm/v1/${endpoint}?${query}`
      );
      const resJson = await res.json();
      if (resJson.code == 200) {
        setItems(resJson.data.data);
        setLoading(false);
      }
    }
    if (!options) getItems();
  }, [query, endpoint]);

  // Handle new list or tag creation
  const addNewItem = async () => {
    let body = {
      title: search,
    };

    setLoading(true);
    createNewGroup(endpoint, body).then((response) => {
      if (201 === response.code) {
        setSearch("");
        setQuery("");
        setSelected([...selected, { id: response?.data, title: body.title }]);
        setNotificationType("success");
        setShowNotification("block");
        setMessage(response?.message);
        props.setIsAssignTo(true);
      } else {
        setNotificationType("warning");
        setShowNotification("block");
        setMessage(response?.message);
      }
      setLoading(false);
      ClearNotification("none", setShowNotification);
    });
  };

  // function used for checking whether the current item is selected or not
  const checkIfSelected = (id) => {
    const checked = selected?.findIndex((item) => item.id == id) >= 0;
    return checked;
  };

  // handler for one single item click for both list item and checkbox rendering
  const handleSelectOne = (e) => {
    e.stopPropagation();
    // since this function is handling input for both checkboxes and li elements
    // there might be either id and value for input checkboxes
    // or custom ID and custom Value dataset attribute for li elements
    let value = e.target.value ? e.target.value : e.target.dataset.customValue;
    let id = e.target.id ? e.target.id : e.target.dataset.customId;
    const index = selected?.findIndex((item) => item.id == id);
    // already in selected list so remove it from the array
    if (allowMultiple) {
      if (index >= 0) {
        setSelected(selected.filter((item) => item.id != id));
      } else {
        // add id to the array
        setSelected([...selected, { id: id, title: value }]);
      }
    } else {
      if (index >= 0) setSelected([]);
      else setSelected([{ id: id, title: value }]);
    }
  };

  // helper function to set the search query only when there are at least 3 characters or more
  function handleSearch(e) {
    e.stopPropagation();
    e.preventDefault();
    const value = e.target.value;
    setSearch(value);
    if (value.length >= 1) setQuery(`&search=${value}`);
    else setQuery("");
  }

  const handleAssignLists = async () => {
    let res = null;
    let body;
    "lists" == endpoint
      ? (body = {
          lists: selected,
        })
      : (body = {
          tags: selected,
        });
    try {
      // create contact
      setLoading(true);
      res = await fetch(
        `${window.MRM_Vars.api_base_url}mrm/v1/contacts/${contactId}/groups`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const resJson = await res.json();
      if (resJson.code == 201) {
        setSearch("");
        setQuery("");
        setSelected([]);
        props.setIsAssignTo(!props.isActive);
        setNotificationType("success");
        setShowNotification("block");
        setMessage(resJson.message);
        props.setRefresh(!props.refresh);
      } else {
        setNotificationType("warning");
        setShowNotification("block");
        setMessage(resJson.message);
      }
      ClearNotification("none", setShowNotification);
    } catch (e) {
    } finally {
      setLoading(false);
      ClearNotification("none", setShowNotification);
    }
  };

  return (
    <>
      <ul
        className={
          props.isActive
            ? "assigned-to mintmrm-dropdown show"
            : "assigned-to mintmrm-dropdown"
        }
      >
        <li className="searchbar">
          <span class="pos-relative">
            <Search />
            <input
              type="search"
              name="column-search"
              placeholder="Create or find"
              value={search}
              onChange={handleSearch}
            />
          </span>
        </li>
        <li className="list-title">{listTitle}</li>
        <div className="option-section">
          {items?.length > 0 &&
            !options &&
            !loading &&
            items.map((item, index) => {
              let checked = checkIfSelected(item.id);
              return (
                <li
                  key={index}
                  className={
                    checked
                      ? "single-column mrm-custom-select-single-column-selected"
                      : "single-column"
                  }
                >
                  <div class="mintmrm-checkbox">
                    <input
                      type="checkbox"
                      name={item.id}
                      id={item.id}
                      value={item.title}
                      onChange={handleSelectOne}
                      checked={checked}
                    />

                    <label for={item.id} className="mrm-custom-select-label">
                      {item.title}
                    </label>
                  </div>
                </li>
              );
            })}
        </div>
        {items?.length == 0 && allowNewCreate && !loading && !options && (
          <>
            <button className="mrm-custom-select-add-btn" onClick={addNewItem}>
              {`+ Create new ${name} "${search}"`}
            </button>
          </>
        )}
        {/* <div className="no-found">
        <span>No List found</span>
      </div> */}
        {loading && <LoadingIndicator type="table" />}
        <Link className="add-action" to="" onClick={handleAssignLists}>
          <Plus />
          Assign {placeholder}
        </Link>
        {/* {contactListColumns.map((column, index) => {
              <li className="single-column">
                <ColumnList title={column.title} key={index} />
              </li>;
            })} */}
      </ul>
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
