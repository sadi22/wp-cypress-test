import React from "react";

const MobileView = (props) => {
  const { blockData } = props;
  return (
    <>
      <div className="resposive-preview-mobile">
        <div
          className="form-preview-inner"
          dangerouslySetInnerHTML={{ __html: blockData }}
        ></div>
      </div>
    </>
  );
};

export default MobileView;
