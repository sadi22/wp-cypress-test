import { useEffect, useMemo, useRef, useState } from "react";
import { useGlobalStore } from "../../hooks/useGlobalStore";
import CrossIcon from "../Icons/CrossIcon";
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
    setFilterAdder,
    filterAdder,
    filterRequest,

    prefix,
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
  const [groups, setGroups] = useState([]);
  const [searchItems, setSearchItems] = useState("");

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
  const filteredItems = useMemo(() => {
    if (searchItems) {
      return items.filter(
        (item) =>
          item.title.toLowerCase().indexOf(searchItems.toLocaleLowerCase()) > -1
      );
    }
    return items;
  }, [searchItems, items]);

  // handler for one single item click for both list item and checkbox rendering
  const handleSelectOne = (e) => {
    e.stopPropagation();
    let value = e.target.value ? e.target.value : e.target.dataset.customValue;
    let id = e.target.dataset.customId;
    let name = e.target.name;
    const index = selected.findIndex((item) => item.id == id);

    if (allowMultiple) {
      if (index >= 0) {
        // already in selected list so remove it from the array
        setSelected(selected.filter((item) => item.id != id));

        setFilterAdder((prev) => ({
          ...prev,
          [name]: filterAdder[name].filter((item) => {
            return item != id;
          }),
        }));
      } else {
        // add id to the array
        setSelected([...selected, { id: id, title: value }]);
        setFilterAdder((prev) => ({
          ...prev,
          [name]: [...prev[name], id],
        }));
      }
    } else {
      if (index >= 0) setSelected([]);
      else {
        setSelected([{ id: id, title: value }]);
        setFilterAdder((prev) => ({
          ...prev,
          [name]: [...prev[name], id],
        }));
      }
    }
  };

  // function used for checking whether the current item is selected or not
  const checkIfSelected = (id) => {
    const checked = groups?.findIndex((item) => item == id) >= 0;
    return checked;
  };

  useEffect(() => {
    const lists = filterRequest?.lists_ids;
    const tags = filterRequest?.tags_ids;
    const status = filterRequest?.status;

    const empty_groups = [];
    const all_groups = empty_groups?.concat(status, tags, lists);
    setGroups(all_groups);
  }, [filterRequest]);

  const deleteSelected = (e, id) => {
    const index = selected.findIndex((item) => item.id == id);
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
    if (endpoint == "/status") {
      setItems([
        {
          title: "Subscribed",
          id: "subscribed",
        },
        {
          title: "Unsubscribed",
          id: "unsubscribed",
        },
        {
          title: "Pending",
          id: "pending",
        },
      ]);
    } else {
      async function getItems() {
        if (endpoint == "/lists") {
          setItems(window.MRM_Vars.lists.data);
        } else {
          setItems(window.MRM_Vars.tags.data);
        }
      }
      if (!options) getItems();
    }
  }, [query]);

  return (
    <>
      <div className="mrm-custom-select-container" key="container">
        <button
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
        <div className="mrm-selected-items-container">
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
        </div>
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
                  onChange={(e) => setSearchItems(e.target.value)}
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
          {filteredItems?.length > 0 &&
            !options &&
            !loading &&
            filteredItems.map((item, index) => {
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
                      name={props.name}
                      id={prefix + item.id}
                      value={item.title}
                      data-custom-id={item.id}
                      onChange={handleSelectOne}
                      checked={checked}
                    />

                    <label
                      for={prefix + item.id}
                      className="mrm-custom-select-label"
                    >
                      {item.title}
                    </label>
                  </div>
                </li>
              );
            })}
          {filteredItems?.length == 0 ? (
            <div className="no-item-found">No item found</div>
          ) : null}
          {loading && <LoadingIndicator type="table" />}
        </ul>
      </div>
    </>
  );
}
