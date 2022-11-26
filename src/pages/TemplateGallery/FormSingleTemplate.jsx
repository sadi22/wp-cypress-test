import React from "react";

export default function FormSingleTemplate(props) {
  const { id, title, featured_image } = props.template;
  const { onImportTemplate, setSaveLoader, saveLoader } = props;

  const templateBgImage = {
    backgroundImage: "url(" + featured_image + ")",
  };

  return (
    <>
      <div className="mintmrm-single-template">
        <div className="mintmrm-single-remote-wrapper">
          <div className="mintmrm-single-remote-template">
            <div className="hoverlay">
              <button
                type="button"
                className={
                  saveLoader
                    ? "select-this mintmrm-btn show-loader"
                    : "select-this mintmrm-btn"
                }
                onClick={() => onImportTemplate(id)}
              >
                {saveLoader ? "Importing " + title : "Select"}
                <span className="mintmrm-loader"></span>
              </button>
            </div>
            <div
              className="template-image-wrapper"
              style={templateBgImage}
            ></div>
          </div>

          <div className="template-info">
            <span className="title">{title}</span>
          </div>
        </div>
      </div>
    </>
  );
}
