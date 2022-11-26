import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function CampaignSingleTemplate(props) {

  const templateBgImage = {
    backgroundImage: 'url(http://mrm.local/wp-content/uploads/2022/11/template-thumbnail.jpg)',
  }

  return (
    <>
      <div className="mintmrm-single-template">
        <div className="mintmrm-single-remote-wrapper">
          <div className="mintmrm-single-remote-template">
            <div className="hoverlay">
              <button type="button" className="select-this mintmrm-btn">Select</button>
            </div>
            <div className="template-image-wrapper" style={templateBgImage} > 
            
            </div>
          </div>

          <div className="template-info">
            <span className="title">Campaign Template Title</span>
          </div>
        </div>

      </div>

    </>
  );
}
