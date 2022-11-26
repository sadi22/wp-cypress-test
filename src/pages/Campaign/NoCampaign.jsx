import React from "react";
import OpenEnvelopeIcon from "../../components/Icons/OpenEnvelopeIcon";

export default function NoCampaign(props) {
  return (
    <div className="table-row">
      <div className="table-data no-campaign" colSpan={6}>
        <div className="no-campaign-wrapper">
          <OpenEnvelopeIcon />
          <span className="title">
            No campaign found {props.search ? `"${props.search}"` : null}{" "}
          </span>
        </div>
      </div>
    </div>
  );
}
