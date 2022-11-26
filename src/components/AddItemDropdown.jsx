import { ClearNotification } from "../utils/admin-notification";
import { useMemo, useState } from "react";
import Search from "./Icons/Search";
import SuccessfulNotification from "./SuccessfulNotification";
import { createNewGroup } from "../services/Common";

export default function AddItemDropdown(props) {
  const {
    selected,
    setSelected,
    endpoint,
    items,
    allowMultiple,
    allowNewCreate,
    name,
    title,
    refresh,
    setRefresh,
    prefix
  } = props;
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [showNotification, setShowNotification] = useState("none");
  const [notificationType, setNotificationType] = useState("success");

  const filteredItems = useMemo(() => {
    if (search) {
      return items.filter(
        (item) =>
          item.title.toLowerCase().indexOf(search.toLocaleLowerCase()) > -1
      );
    }
    return items;
  }, [search, items]);

  const checkIfSelected = (id) => {
    const checked = selected?.findIndex((item) => item.id == id) >= 0;
    return checked;
  };

  // Select or unselect items from the list
  const handleSelectOne = (e) => {
    e.stopPropagation();
    let value = e.target.value ? e.target.value : e.target.dataset.customValue;
    // let id = e.target.id ? e.target.id : e.target.dataset.customId;
    let id = e.target.dataset.customId;
    const index = selected?.findIndex((item) => item.id == id);
    if (allowMultiple) {
      if (index >= 0) {
        setSelected(selected.filter((item) => item.id != id));
      } else {
        // add id to the array
        setSelected([...selected, { id: id, title: value }]);
        // setSelected([...selected, id]);
      }
    } else {
      if (index >= 0) setSelected([]);
      else setSelected([{ id: id, title: value }]);
    }
  };

  // Handle new list or tag creation
  const addNewItem = async () => {
    let body = {
      title: search,
    };

    createNewGroup(endpoint, body).then((response) => {
      if (201 === response.code) {
        setSearch("");
        setSelected([...selected, { id: response?.data, title: body.title }]);
        setNotificationType("success");
        setShowNotification("block");
        setMessage(response?.message);
        setRefresh(!refresh);
      } else {
        setNotificationType("warning");
        setShowNotification("block");
        setMessage(response?.message);
      }
      ClearNotification("none", setShowNotification);
    });
  };

  return (
    <>
      <ul
        className={
          props.isActive
            ? "add-contact mintmrm-dropdown show"
            : "add-contact mintmrm-dropdown"
        }
      >
        <li className="searchbar">
          <span class="pos-relative">
            <Search />
            <input
              type="search"
              name="column-search"
              placeholder="Search or create"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </span>
        </li>
        <li className="list-title">{title}</li>
        <div className="option-section">
          {filteredItems?.length > 0 &&
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
                      name={item.id}
                      id={prefix + item.id}
                      value={item.title}
                      data-custom-id={item.id}
                      onChange={handleSelectOne}
                      checked={checked}
                    />

                    <label for={prefix +item.id} className="mrm-custom-select-label">
                      {item.title}
                    </label>
                  </div>
                </li>
              );
            })}
        </div>
        {filteredItems?.length == 0 && allowNewCreate && (
          <>
            <button className="mrm-custom-select-add-btn" onClick={addNewItem}>
              {search ? `+ Create new ${name} "${search}"` : `+ Create new ${name} ${search}` }
            </button>
          </>
        )}
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
