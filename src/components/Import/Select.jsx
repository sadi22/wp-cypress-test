import { useEffect, useState } from "react";
import { ClearNotification } from "../../utils/admin-notification";
import Search from "../Icons/Search";
import LoadingIndicator from "../LoadingIndicator";
import SuccessfulNotification from "../SuccessfulNotification";

export default function Select(props) {
  const {
    selected,
    setSelected,
    options = null,
    endpoint = "/lists",
    page = 1,
    perPage = 15,
    name = "list", // used inside the new button of
    listTitle = "CHOOSE LIST",
    listTitleOnNotFound = "No Data Found",
    searchPlaceHolder = "Search...",
    allowMultiple = true,
    showSearchBar = true,
    showListTitle = true,
    allowNewCreate = true,
  } = props;

  // store retrieved
  const [items, setItems] = useState([]);
  // search input value is stored here
  const [search, setSearch] = useState("");

  // search query, search query only updates when there are more than 3 characters typed
  const [query, setQuery] = useState("");

  // loading or not
  const [loading, setLoading] = useState(false);
  const [showNotification, setShowNotification] = useState("none");
  const [notificationType, setNotificationType] = useState("success");
  const [message, setMessage] = useState("");

  // helper function to set the search query only when there are at least 3 characters or more
  function handleSearch(e) {
    e.stopPropagation();
    e.preventDefault();
    const value = e.target.value;
    setSearch(value);
    if (value.length) setQuery(`&search=${value}`);
    else setQuery("");
  }

  // handler for one single item click for both list item and checkbox rendering
  const handleSelectOne = (e) => {
    e.stopPropagation();
    let id = e.target.id ? e.target.id : e.target.dataset.customId;
    const index = selected?.findIndex((item) => item == id);

    // already in selected list so remove it from the array
    if (allowMultiple) {
      if (index >= 0) {
        setSelected(selected.filter((item) => item != id));
      } else {
        setSelected([...selected, id]);
      }
    } else {
      if (index >= 0) setSelected([]);
      else setSelected([id]);
    }
  };

  // function used for checking whether the current item is selected or not
  const checkIfSelected = (id) => {
    const checked = selected?.findIndex((item) => item == id) >= 0;
    return checked;
  };

  // at first page load get all the available lists
  // keep fetching lists whenever user types something in the search bar
  useEffect(() => {
    async function getItems() {
      setLoading(true);
      const res = await fetch(
        `${window.MRM_Vars.api_base_url}mrm/v1${endpoint}?&page=${page}&per-page=${perPage}${query}`
      );
      const resJson = await res.json();
      if (resJson.code == 200) {
        setItems(resJson.data.data);
        setLoading(false);
      } else {
      }
    }
    if (!options) getItems();
  }, [query]);

  // Handle new list or tag creation
  const addNewItem = async () => {
    let res = null;
    let body = {
      title: search,
      slug: search.toLowerCase().replace(/[\W_]+/g, "-"),
    };
    try {
      // create contact
      setLoading(true);
      res = await fetch(`${window.MRM_Vars.api_base_url}mrm/v1${endpoint}`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const resJson = await res.json();
      if (resJson.code == 201) {
        setSearch("");
        setQuery("");
        setSelected([...selected, resJson.data]);
        setNotificationType("success");
        setShowNotification("block");
        setMessage(resJson?.message);
      } else {
        setNotificationType("warning");
        setShowNotification("block");
        setMessage(resJson?.message);
      }
      ClearNotification("none", setShowNotification);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ul
        className={
          props.isActive
            ? "mintmrm-dropdown mrm-custom-select-dropdown show"
            : "mintmrm-dropdown mrm-custom-select-dropdown"
        }
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {showSearchBar && (
          <li className="searchbar" key="hello">
            <span class="pos-relative">
              <Search />
              <input
                type="search"
                name="column-search"
                placeholder={searchPlaceHolder}
                value={search}
                onChange={handleSearch}
              />
            </span>
          </li>
        )}
        {showListTitle && (
          <li className="list-title" key="world">
            {!loading
              ? items?.length && !options == 0
                ? listTitleOnNotFound
                : listTitle
              : null}
          </li>
        )}

        <div className="dropdown-options">
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
              {`+ Add new ${name} "${search}"`}
            </button>
          </>
        )}
        {loading && <LoadingIndicator type="table" />}
      </ul>
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
