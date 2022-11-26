import React from "react";

const DesktopView = (props) => {
  const { blockData } = props;
  return (
    <>
      <div className="resposive-preview-desktop">
        <div
          className="form-preview-inner"
          dangerouslySetInnerHTML={{ __html: blockData }}
        ></div>
      </div>
    </>
  );
};

export default DesktopView;
