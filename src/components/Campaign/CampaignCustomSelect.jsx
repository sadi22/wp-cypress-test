import { useEffect, useMemo, useState } from "react";
import { getListsToDropDown } from "../../services/List";
import { getTagsToDropDown } from "../../services/Tag";
import CrossIcon from "../Icons/CrossIcon";
import Search from "../Icons/Search";
import OptionList from "./OptionList";

export default function CampaignCustomSelect(props) {
  const [activeList, setActiveList] = useState(true);
  const [activeTag, setActiveTag] = useState(false);
  const [lists, setLists] = useState([]);
  const [tags, setTags] = useState([]);
  const [searchTag, setSearchTag] = useState("");
  const [searchList, setSearchList] = useState("");

  const filteredTags = useMemo(() => {
    if (searchTag) {
      return tags.filter(
        (item) =>
          item.title.toLowerCase().indexOf(searchTag.toLocaleLowerCase()) > -1
      );
    }
    return tags;
  }, [searchTag, tags]);

  const filteredLists = useMemo(() => {
    if (searchList) {
      return lists.filter(
        (item) =>
          item.title.toLowerCase().indexOf(searchList.toLocaleLowerCase()) > -1
      );
    }
    return lists;
  }, [searchList, lists]);

  const showTag = () => {
    setActiveTag(true);
    setActiveList(false);
  };
  const showList = () => {
    setActiveTag(false);
    setActiveList(true);
  };

  // const deleteItem = (id) => {
  //   const updatedListItem = checkList.filter((item, index) => {
  //     return index != id;
  //   });
  //   const updatedTagItem = checktag.filter((item, index) => {
  //     return index != id;
  //   });
  //   setCheckList(updatedListItem);
  //   setChecktag(updatedTagItem);
  // };

  const deleteSelectedTag = (e, id) => {
    const index = props.recipientTags?.findIndex((item) => item.id == id);

    // already in selected list so remove it from the array
    if (index >= 0) {
      props.setRecipientTags(
        props.recipientTags.filter((item) => item.id != id)
      );
    }
  };
  const deleteSelectedList = (e, id) => {
    const index = props.recipientLists?.findIndex((item) => item.id == id);

    // already in selected list so remove it from the array
    if (index >= 0) {
      props.setRecipientLists(
        props.recipientLists.filter((item) => item.id != id)
      );
    }
  };

  const deleteAllTag = () => {
    props.setRecipientTags([]);
  };
  const deleteAllList = () => {
    props.setRecipientLists([]);
  };
  useEffect(() => {
    // Get lists
    getListsToDropDown().then((results) => {
      setLists(results.data);
    });
    // Get tags
    getTagsToDropDown().then((results) => {
      setTags(results.data);
    });
  }, []);

  const checkIfSelectedList = (id) => {
    const checkedList =
      props.recipientLists?.findIndex((item) => item.id == id) >= 0;
    return checkedList;
  };
  const checkIfSelectedTag = (id) => {
    const checkedTag =
      props.recipientTags?.findIndex((item) => item.id == id) >= 0;
    return checkedTag;
  };

  return (
    <>
      <div
        className={
          props.dropDown ? "recipient-dropdown" : "recipient-dropdown inactive"
        }
      >
        <div className="dropdown-header">
          <button
            className={
              activeList ? "tab-button active list-btn" : "tab-button list-btn"
            }
            onClick={showList}
          >
            List
          </button>

          <button
            className={
              activeTag ? "tab-button active tag-btn" : "tab-button tag-btn"
            }
            onClick={showTag}
          >
            Tag
          </button>
        </div>
        {activeTag ? (
          <div className="options-section">
            <div
              className={
                props.recipientTags?.length != 0
                  ? "selected-items"
                  : "selected-items inactive"
              }
            >
              <div className="items">
                {props.recipientTags?.map((item, index) => {
                  return (
                    <span key={index}>
                      {item.title}
                      <div
                        className="cross-icon"
                        onClick={(e) => deleteSelectedTag(e, item.id)}
                      >
                        <CrossIcon />
                      </div>
                    </span>
                  );
                })}
              </div>
              <button
                className={
                  props.recipientTags?.length == 0
                    ? "clear-btn inactive"
                    : "clear-btn"
                }
                onClick={deleteAllTag}
              >
                Clear
              </button>
            </div>
            <div className="dropdown-body">
              <div className="searchbar">
                <div class="pos-relative">
                  <Search />
                  <input
                    className="recipient-input"
                    type="search"
                    placeholder="Search tag"
                    value={searchTag}
                    onChange={(e) => setSearchTag(e.target.value)}
                  />
                </div>
              </div>
              <div className="checkbox-options">
                {filteredTags?.length > 0 &&
                  filteredTags.map((item, index) => {
                    let checkedTag = checkIfSelectedTag(item.id);
                    return (
                      <li
                        key={index}
                        className={
                          checkedTag
                            ? "single-column mrm-custom-select-single-column-selected"
                            : "single-column"
                        }
                      >
                        <OptionList
                          selected={props.recipientTags}
                          setSelected={props.setRecipientTags}
                          allowMultiple={true}
                          id={item.id}
                          title={item.title}
                          checked={checkedTag}
                        />
                      </li>
                    );
                  })}
                {filteredTags?.length == 0 ? (
                  <div className="no-item-found">No item found</div>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
        {activeList ? (
          <div className="options-section">
            <div
              className={
                props.recipientLists?.length != 0
                  ? "selected-items"
                  : "selected-items inactive"
              }
            >
              <div className="items">
                {props.recipientLists?.map((item, index) => {
                  return (
                    <span key={index}>
                      {item.title}
                      <div
                        className="cross-icon"
                        onClick={(e) => deleteSelectedList(e, item.id)}
                      >
                        <CrossIcon />
                      </div>
                    </span>
                  );
                })}
              </div>
              <button
                className={
                  props.recipientLists?.length == 0
                    ? "clear-btn inactive"
                    : "clear-btn"
                }
                onClick={deleteAllList}
              >
                Clear
              </button>
            </div>
            <div className="dropdown-body">
              <div className="searchbar">
                <div class="pos-relative">
                  <Search />
                  <input
                    className="recipient-input"
                    type="search"
                    placeholder="Search tag"
                    onChange={(e) => setSearchList(e.target.value)}
                  />
                </div>
              </div>
              <div className="checkbox-options option-section">
                {filteredLists?.length > 0 &&
                  filteredLists.map((item, index) => {
                    let checkedList = checkIfSelectedList(item.id);
                    return (
                      <li
                        key={index}
                        className={
                          checkedList
                            ? "single-column mrm-custom-select-single-column-selected"
                            : "single-column"
                        }
                      >
                        <OptionList
                          selected={props.recipientLists}
                          setSelected={props.setRecipientLists}
                          allowMultiple={true}
                          id={item.id}
                          title={item.title}
                          checked={checkedList}
                        />
                      </li>
                    );
                  })}
                {filteredLists?.length == 0 ? (
                  <div className="no-item-found">No item found</div>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
