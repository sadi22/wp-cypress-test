import { useState, useEffect, useRef } from "react";
import Search from "./Icons/Search";
import ListenForOutsideClicks from "./ListenForOutsideClicks";

export default function SelectDropdown(props) {
  const { options } = props;
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("");

  const [isActiveMap, setIsActiveMap] = useState(false);

  //Detect Outside Click to Hide Dropdown Element
  const menuRef = useRef(null)
  const [listening, setListening] = useState(false)
  useEffect(ListenForOutsideClicks(listening, setListening, menuRef, setIsActiveMap))

  function handleSearch(e) {
    e.stopPropagation();
    e.preventDefault();
    const value = e.target.value;
    setSearch(value);
    if (value.length >= 1) setQuery(`&search=${value}`);
    else setQuery("");
  }
  const handleMap = () => {
    setIsActiveMap(!isActiveMap);
  };
  const handleSelect = (id, title, field_value) => {
    setSelected(title);
    setIsActiveMap(false);
    props.handleSelect(id, title, field_value)
  };
  return (
    <>
      <button
        type="button"
        className={isActiveMap ? "drop-down-button show" : "drop-down-button"}
        onClick={handleMap}
        ref={menuRef}
      >
        {selected ? selected : "Do not import this field"}
      </button>
      <ul
        className={
          isActiveMap
            ? "import-map mintmrm-dropdown show"
            : "import-map mintmrm-dropdown"
        }
      >
        <li className="searchbar">
          <span class="pos-relative">
            <Search />
            <input
              type="search"
              name="column-search"
              placeholder="find or choose"
              value={search}
              onChange={handleSearch}
            />
          </span>
        </li>
        <li className="list-title">Choose Field</li>
        <div className="option-section">
          {options.map((option, id) => {
            return (
              <li
                key={id}
                className="single-column"
                onClick={() => handleSelect(option.id, option.title, props.field_value)}
              >
                <div class="mintmrm-checkbox">
                  <label className="mrm-custom-select-label">
                    {option.title}
                  </label>
                </div>
              </li>
            );
          })}
        </div>
        {/* <div className="no-found">
          <span>No List found</span>
        </div> */}
      </ul>
    </>
  );
}
