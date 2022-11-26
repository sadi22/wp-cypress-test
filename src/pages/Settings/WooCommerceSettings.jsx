import React, { useEffect, useRef, useState } from "react";
import AddItemDropdown from "../../components/AddItemDropdown";
import CrossIcon from "../../components/Icons/CrossIcon";
import TooltipQuestionIcon from "../../components/Icons/TooltipQuestionIcon";
import WooCommerceIcon from "../../components/Icons/WooCommerceIcon";
import ListenForOutsideClicks from "../../components/ListenForOutsideClicks";
import SuccessfulNotification from "../../components/SuccessfulNotification";
import { getLists } from "../../services/List";
import { getTags } from "../../services/Tag";
import { ClearNotification } from "../../utils/admin-notification";
import { AdminNavMenuClassChange } from "../../utils/admin-settings";
import SettingsNav from "./SettingsNav";

export default function WooCommerceSettings() {
  // Admin active menu selection
  AdminNavMenuClassChange("mrm-admin", "settings");
  const [selectSwitch, setSelectSwitch] = useState(true);
  const [checkboxLabel, setCheckboxLabel] = useState("");
  const [lists, setLists] = useState([]);
  const [tags, setTags] = useState([]);
  const [isActiveList, setIsActiveList] = useState(false);
  const [isActiveTag, setIsActiveTag] = useState(false);
  const [assignLists, setAssignLists] = useState([]);
  const [assignTags, setAssignTags] = useState([]);
  const [refresh, setRefresh] = useState();
  const [loading, setLoader] = useState(false);
  const [showNotification, setShowNotification] = useState("none");
  const [notificationType, setNotificationType] = useState("success");
  const [message, setMessage] = useState("");
  const listMenuRef = useRef(null);
  const tagMenuRef = useRef(null);
  const [listening, setListening] = useState(false);

  useEffect(
    ListenForOutsideClicks(
      listening,
      setListening,
      listMenuRef,
      setIsActiveList
    )
  );
  useEffect(
    ListenForOutsideClicks(listening, setListening, tagMenuRef, setIsActiveTag)
  );

  // Fetch lists & tags
  useEffect(() => {
    // Get lists
    getLists().then((results) => {
      results.data.map(function () {
        setLists(results.data);
      });
    });

    // Get tags
    getTags().then((results) => {
      setTags(results.data);
    });
  }, [refresh]);

  const handleSwitcher = () => {
    setSelectSwitch(!selectSwitch);
  };

  const handleList = () => {
    setIsActiveList(!isActiveList);
  };

  const deleteSelectedList = (e, id) => {
    const index = assignLists.findIndex((item) => item.id == id);

    // already in selected list so remove it from the array
    if (0 <= index) {
      setAssignLists(assignLists.filter((item) => item.id != id));
    }
  };

  const handleTag = () => {
    setIsActiveTag(!isActiveTag);
  };

  const deleteSelectedTag = (e, id) => {
    const index = assignTags.findIndex((item) => item.id == id);

    // already in selected list so remove it from the array
    if (0 <= index) {
      setAssignTags(assignTags.filter((item) => item.id != id));
    }
  };

  const saveSettings = async () => {
    let response = null;
    let wcSettingsData = {
      enable: selectSwitch,
      checkbox_label: checkboxLabel,
      lists: assignLists,
      tags: assignTags,
    };

    try {
      // create contact
      setLoader(true);
      response = await fetch(
        `${window.MRM_Vars.api_base_url}mrm/v1/settings/wc`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(wcSettingsData),
        }
      );
      const responseData = await response.json();

      if (200 === response.status) {
        setNotificationType("success");
        setShowNotification("block");
        setMessage(responseData?.message);
      } else if (false === responseData.success) {
        setNotificationType("warning");
        setShowNotification("block");
        setMessage(responseData?.message);
      }
      ClearNotification("none", setShowNotification);
    } catch (e) {
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    const getWCData = async () => {
      const response = await fetch(
        `${window.MRM_Vars.api_base_url}mrm/v1/settings/wc`
      );
      const jsonResponse = await response.json();

      if (true === jsonResponse.success) {
        setSelectSwitch(jsonResponse.enable);
        setCheckboxLabel(jsonResponse.checkbox_label);
        setAssignLists(jsonResponse.lists);
        setAssignTags(jsonResponse.tags);
      }
    };
    getWCData();
  }, []);
  return (
      <div className="mintmrm-settings-page">
          <div className="mintmrm-container">
              <div className="mintmrm-settings">
                  <h2 class="conatct-heading">Settings</h2>

                  <div className="mintmrm-settings-wrapper">
                      <SettingsNav />

                      <div className="settings-tab-content">
                          <div className="single-tab-content woocommerce-tab-content">
                              <div className="tab-body">
                                  <header className="tab-header">
                                      <h4 className="title">
                                          <WooCommerceIcon />
                                          WooCommerce Settings
                                      </h4>
                                  </header>

                                  <div className="form-wrapper">
                                      <div className="form-group">
                                          <label htmlFor="">
                                              Opt-in on Checkout
                                              <span class="mintmrm-tooltip">
                                                  <TooltipQuestionIcon />
                                                  <p>
                                                      Define behaviour of the
                                                      form after submission
                                                  </p>
                                              </span>
                                          </label>
                                          <span className="mintmrm-switcher">
                                              <input
                                                  type="checkbox"
                                                  name="checkedB"
                                                  id="st"
                                                  checked={selectSwitch}
                                                  defaultChecked={selectSwitch}
                                                  onChange={handleSwitcher}
                                              />
                                              <label htmlFor="st"></label>
                                          </span>
                                      </div>
                                      {selectSwitch ? (
                                          <>
                                              <div className="form-group">
                                                  <label htmlFor="woocommerce-switcher">
                                                      Checkbox Label
                                                      <span class="mintmrm-tooltip">
                                                          <TooltipQuestionIcon />
                                                          <p>
                                                              Define behaviour
                                                              of the form after
                                                              submission
                                                          </p>
                                                      </span>
                                                  </label>
                                                  <input
                                                      id="woocommerce-switcher"
                                                      type="text"
                                                      name="checkbox-label"
                                                      maxLength={998}
                                                      placeholder="Enter Checkbox label Text"
                                                      value={checkboxLabel}
                                                      onChange={(event) =>
                                                          setCheckboxLabel(
                                                              event.target.value
                                                          )
                                                      }
                                                  />
                                              </div>
                                              <hr />

                                              <div
                                                  className="form-group label-block"
                                                  ref={listMenuRef}
                                              >
                                                  <label>
                                                      Assign List
                                                      <span class="mintmrm-tooltip">
                                                          <TooltipQuestionIcon />
                                                          <p>
                                                              Define behaviour
                                                              of the form after
                                                              submission
                                                          </p>
                                                      </span>
                                                  </label>

                                                  <div className="input-custom-wrapper">
                                                      <button
                                                          type="button"
                                                          className={
                                                              isActiveList
                                                                  ? "drop-down-button show"
                                                                  : "drop-down-button"
                                                          }
                                                          onClick={handleList}
                                                      >
                                                          {assignLists.length !=
                                                          0
                                                              ? assignLists?.map(
                                                                    (list) => {
                                                                        return (
                                                                            <span
                                                                                className="single-list"
                                                                                key={
                                                                                    list.id
                                                                                }
                                                                            >
                                                                                {
                                                                                    list.title
                                                                                }

                                                                                <span
                                                                                    className="close-list"
                                                                                    title="Delete"
                                                                                    onClick={(
                                                                                        e
                                                                                    ) =>
                                                                                        deleteSelectedList(
                                                                                            e,
                                                                                            list.id
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <CrossIcon />
                                                                                </span>
                                                                            </span>
                                                                        );
                                                                    }
                                                                )
                                                              : "Select Lists"}
                                                      </button>
                                                      <AddItemDropdown
                                                          isActive={
                                                              isActiveList
                                                          }
                                                          setIsActive={
                                                              setIsActiveList
                                                          }
                                                          selected={assignLists}
                                                          setSelected={
                                                              setAssignLists
                                                          }
                                                          endpoint="lists"
                                                          items={lists}
                                                          allowMultiple={true}
                                                          allowNewCreate={true}
                                                          name="list"
                                                          title="CHOOSE LIST"
                                                          refresh={refresh}
                                                          setRefresh={
                                                              setRefresh
                                                          }
                                                          prefix="woocommerce"
                                                      />
                                                  </div>
                                              </div>

                                              <div
                                                  className="form-group label-block"
                                                  ref={tagMenuRef}
                                              >
                                                  <label>
                                                      Assign Tag
                                                      <span class="mintmrm-tooltip">
                                                          <TooltipQuestionIcon />
                                                          <p>
                                                              Define behaviour
                                                              of the form after
                                                              submission
                                                          </p>
                                                      </span>
                                                  </label>

                                                  <div className="input-custom-wrapper">
                                                      <button
                                                          type="button"
                                                          className={
                                                              isActiveTag
                                                                  ? "drop-down-button show"
                                                                  : "drop-down-button"
                                                          }
                                                          onClick={handleTag}
                                                      >
                                                          {assignTags.length !=
                                                          0
                                                              ? assignTags?.map(
                                                                    (tag) => {
                                                                        return (
                                                                            <span
                                                                                className="single-list"
                                                                                key={
                                                                                    tag.id
                                                                                }
                                                                            >
                                                                                {
                                                                                    tag.title
                                                                                }

                                                                                <span
                                                                                    className="close-list"
                                                                                    title="Delete"
                                                                                    onClick={(
                                                                                        e
                                                                                    ) =>
                                                                                        deleteSelectedTag(
                                                                                            e,
                                                                                            tag.id
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <CrossIcon />
                                                                                </span>
                                                                            </span>
                                                                        );
                                                                    }
                                                                )
                                                              : "Select Tags"}
                                                      </button>

                                                      <AddItemDropdown
                                                          isActive={isActiveTag}
                                                          setIsActive={
                                                              setIsActiveTag
                                                          }
                                                          selected={assignTags}
                                                          setSelected={
                                                              setAssignTags
                                                          }
                                                          endpoint="tags"
                                                          items={tags}
                                                          allowMultiple={true}
                                                          allowNewCreate={true}
                                                          name="tag"
                                                          title="CHOOSE TAG"
                                                          refresh={refresh}
                                                          setRefresh={
                                                              setRefresh
                                                          }
                                                          prefix="woocommerce"
                                                      />
                                                  </div>
                                              </div>
                                          </>
                                      ) : null}
                                  </div>
                              </div>

                              <div className="tab-footer">
                                  <button
                                      className="mintmrm-btn"
                                      type="button"
                                      onClick={saveSettings}
                                      disabled={loading}
                                  >
                                      Save Settings
                                      <span
                                          className={
                                              loading ? "mintmrm-loader" : ""
                                          }
                                      ></span>
                                  </button>
                              </div>
                          </div>
                      </div>
                      {/* end settings-tab-content */}
                  </div>
              </div>
              <SuccessfulNotification
                  display={showNotification}
                  setShowNotification={setShowNotification}
                  message={message}
                  notificationType={notificationType}
                  setNotificationType={setNotificationType}
              />
          </div>
      </div>
  );
}
