import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import CompletedCampaignIcon from "../../components/Icons/CompletedCampaignIcon";
import DraftCampaignIcon from "../../components/Icons/DraftCampaignIcon";
import ThreeDotIcon from "../../components/Icons/ThreeDotIcon";
import ListenForOutsideClicks from "../../components/ListenForOutsideClicks";

export default function SingleCampaign(props) {
  const [isActiveDropdown, setIsActiveDropdown] = useState(false);
  const [listening, setListening] = useState(false);

  const menuButtonRef = useRef(null);
  const moreOptionRef = useRef(null);

  useEffect(
    ListenForOutsideClicks(
      listening,
      setListening,
      moreOptionRef,
      setIsActiveDropdown
    )
  );

  return (
    <div className="table-row">
      <div className="table-data email-wrapper campaign-name-wrapper">
        <div className="email campaign-name">
          <span class="mintmrm-checkbox no-title">
            <input
              type="checkbox"
              name={props.campaign.id}
              id={props.campaign.id}
              onChange={props.handleSelectOne}
              checked={props.selected.includes(props.campaign.id)}
            />
            <label for={props.campaign.id}></label>
          </span>
          {props.campaign.type == "sequence" ? (
            <DraftCampaignIcon />
          ) : (
            <CompletedCampaignIcon />
          )}
          <div className="title">
            {" "}
            <Link to={`../campaign/edit/${props.campaign.id}`}>
            {props.campaign.title?.length > 20 ? props.campaign.title.substring(0, 20) + "..." : props.campaign.title}
            </Link>{" "}
            <span>{props.campaign.created_at} ago</span>
          </div>
        </div>
      </div>

      <div className="table-data recipient">-</div>
      <div className="table-data open-rate">-</div>
      <div className="table-data click-rate">-</div>
      <div className="table-data unsubscribers">-</div>
      <div className="table-data status">
        <span
          className={
            props.campaign.status == "draft"
              ? "draft"
              : props.campaign.status == "active"
              ? "active"
              : props.campaign.status == "suspended"
              ? "suspended"
              : "archived"
          }
        >
          {props.campaign.status}
        </span>
      </div>
      <div className="table-data threedot" ref={moreOptionRef}>
        <button
          className="more-option"
          style={{ background: "white", position: "relative" }}
          onClick={() => {
            props.setCurrentActive((prevActive) => {
              // if current list item is already active then hide the overlay menu by setting current active to 0
              if (prevActive == props.campaign.id) {
                return 0;
              } else {
                // show current active as ususal
                return props.campaign.id;
              }
            });
            setIsActiveDropdown((prev) => !prev);
          }}
          ref={menuButtonRef}
        >
          <ThreeDotIcon />
          {isActiveDropdown && ( // only show the menu if both active and current active points to this listitem
            <ul
              className={
                isActiveDropdown // only show the menu if both active and current active points to this listitem
                  ? "mintmrm-dropdown show"
                  : "mintmrm-dropdown"
              }
            >
              {"active" == props.campaign.status ? (
                <li onClick={() => props.handleStatusUpdate(props.campaign.id)}>
                  {" "}
                  Pause
                </li>
              ) : (
                <li
                  onClick={() => {
                    props.editField(props.campaign);
                  }}
                >
                  {"archived" == props.campaign.status ? "View" : "Edit"}
                </li>
              )}

              <li
                className="delete"
                onClick={() => props.deleteCampaign(props.campaign.id)}
              >
                Delete
              </li>
            </ul>
          )}
        </button>
      </div>
      {/* <div className="three-dot">
        <ThreeDotIcon />
      </div> */}
    </div>
  );
}
