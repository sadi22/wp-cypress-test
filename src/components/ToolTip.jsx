import PropTypes from "prop-types";
import React from "react";

const ToolTip = ({ title, children, position, containerClass, theme }) => {
  return (
    <div className={`tooltip ${containerClass}`}>
      {children}
      <div
        className={`tooltiptext ${
          theme === "dark" ? `dark` : `light`
        } tooltip-${position}`}
      >
        {title}
      </div>
    </div>
  );
};

export default ToolTip;

ToolTip.defaultProps = {
  title: "sample",
  children: React.createElement("div"),
  position: "top",
  containerClass: "",
  theme: "light",
};

ToolTip.propTypes = {
  title: PropTypes.string,
  children: PropTypes.element,
  position: PropTypes.string,
  containerClass: PropTypes.string,
  theme: PropTypes.string,
};
