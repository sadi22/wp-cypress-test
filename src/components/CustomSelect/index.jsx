import { useEffect, useRef, useState } from "react";
import { useGlobalStore } from "../../hooks/useGlobalStore";
import Search from "../Icons/Search";
import LoadingIndicator from "../LoadingIndicator";

export default function CustomSelect(props) {
  // global state reference for whether to hide all dropdown
  const hideAllCustomSelect = useGlobalStore(
    (state) => state.hideAllCustomSelect
  );
  // global state reference for which dropdown is currently active
  const activeCustomSelect = useGlobalStore(
    (state) => state.activeCustomSelect
  );
  const {
    selected,
    setSelected,
    options = null,
    endpoint = "/lists",
    page = 1,
    perPage = 15,
    placeholder = "Lists",
    name = "list", // used inside the new button of
    listTitle = "CHOOSE LIST",
    listTitleOnNotFound = "No Data Found",
    searchPlaceHolder = "Search...",
    allowMultiple = true,
    showSearchBar = true,
    showListTitle = true,
    showSelectedInside = true,
    allowNewCreate = true,
  } = props;
  const buttonRef = useRef(null);
  const customSelectUUID = useRef(Math.random());

  // store retrieved
  const [items, setItems] = useState([]);
  // search input value is stored here
  const [search, setSearch] = useState("");

  // search query, search query only updates when there are more than 3 characters typed
  const [query, setQuery] = useState("");

  // loading or not
  const [loading, setLoading] = useState(false);

  // function used for either showing or hiding the dropdown
  function toggleActive(event) {
    event.stopPropagation();
    useGlobalStore.setState({
      hideAllCustomSelect: false,
      activeCustomSelect:
        activeCustomSelect == customSelectUUID.current
          ? null
          : customSelectUUID.current,
    });
  }

  // helper function to set the search query only when there are at least 3 characters or more
  function handleSearch(e) {
    e.stopPropagation();
    e.preventDefault();
    const value = e.target.value;
    setSearch(value);
    if (value.length >= 1) setQuery(`&search=${value}`);
    else setQuery("");
  }

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

  // function used for checking whether the current item is selected or not
  const checkIfSelected = (id) => {
    const checked = selected?.findIndex((item) => item.id == id) >= 0;
    return checked;
  };

  const deleteSelected = (e, id) => {
    const index = selected?.findIndex((item) => item.id == id);

    // already in selected list so remove it from the array
    if (allowMultiple) {
      if (index >= 0) {
        setSelected(selected.filter((item) => item.id != id));
      }
    } else {
      if (index >= 0) setSelected([]);
    }
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
        setSelected([...selected, { id: resJson.data, title: body.title }]);
      } else {
        window.alert(resJson.message);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mrm-custom-select-container" key="container">
        <button
          type="button"
          className={
            activeCustomSelect == customSelectUUID.current &&
            !hideAllCustomSelect
              ? "mrm-custom-select-btn show"
              : "mrm-custom-select-btn"
          }
          onClick={toggleActive}
          ref={buttonRef}
        >
          {placeholder}
        </button>
        {/**code for showing selected items inside the tags container still needs to fix css issues */}
        {/* <div className="mrm-selected-items-container">
          {showSelectedInside &&
            selected.map((item) => {
              return (
                <span key={item.id} className="mrm-custom-selected-items">
                  {item.title}
                  <div
                    className="cross-icon"
                    onClick={(e) => deleteSelected(e, item.id)}
                  >
                    <CrossIcon />
                  </div>
                </span>
              );
            })}
        </div> */}
        <ul
          className={
            activeCustomSelect == customSelectUUID.current &&
            !hideAllCustomSelect
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

          {/* Render all elements while options are specified */}
          {options &&
            options.map((item, index) => {
              let checked = checkIfSelected(item.id);
              return (
                <li
                  key={index}
                  className={
                    checked
                      ? "single-column mrm-custom-select-single-column-selected"
                      : "single-column"
                  }
                  data-custom-id={item.id}
                  data-custom-value={item.title}
                  onClick={handleSelectOne}
                >
                  {item.title}
                </li>
              );
            })}
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
              <button
                className="mrm-custom-select-add-btn"
                onClick={addNewItem}
              >
                {`+ Add new ${name} "${search}"`}
              </button>
            </>
          )}
          {loading && <LoadingIndicator type="table" />}
        </ul>
      </div>
    </>
  );
}
