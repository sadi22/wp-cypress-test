/**
 * External dependencies
 */
import classnames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import { __ } from "@wordpress/i18n";
const { RawHTML, Component, useEffect } = wp.element;
const { RichText } = wp.blockEditor;

/**
 * Internal dependencies
 */

const mrmEmailField = ({
  attributes: {
    formLayout,
    requiredMark,
    inputBgColor,
    inputTextColor,
    inputBorderRadius,
    emailLabel,
    emailPlaceholder,
    inputPaddingTop,
    inputPaddingRight,
    inputPaddingBottom,
    inputPaddingLeft,
    inputBorderStyle,
    inputBorderWidth,
    inputBorderColor,
    rowSpacing,

    labelColor,
    labelSpacing,

    inputTypography,
    labelTypography,
    Typography
  },
}) => {
  let layout = formLayout;
  let fieldSpacing = {
    marginBottom: rowSpacing + "px",
  };

  let labelStyle = {
    color: labelColor,
    marginBottom: labelSpacing + "px",
    fontWeight: labelTypography.weight,
    fontFamily: labelTypography.family,
  };
  let checkboxLabelColor = {
    color: labelColor,
  };

  let inputStyle = {
    backgroundColor: inputBgColor,
    color: inputTextColor,
    borderRadius: inputBorderRadius + "px",
    paddingTop: inputPaddingTop + "px",
    paddingRight: inputPaddingRight + "px",
    paddingBottom: inputPaddingBottom + "px",
    paddingLeft: inputPaddingLeft + "px",
    borderStyle: inputBorderStyle,
    borderWidth: inputBorderWidth + "px",
    borderColor: inputBorderColor,
    fontWeight: inputTypography.weight,
    fontFamily: inputTypography.family,
  };

  return (
    <>
      <div className="mrm-form-group email" style={fieldSpacing}>
        <label htmlFor="mrm-email" style={labelStyle}>
          {emailLabel}
          {emailLabel != "" && <span className="required-mark">*</span>}
        </label>

        <div className="input-wrapper">
          <input
            type="email"
            name="email"
            id="mrm-email"
            placeholder={emailPlaceholder}
            required
            style={inputStyle}
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
          />
        </div>
      </div>
    </>
  );
};

mrmEmailField.propTypes = {
  attributes: PropTypes.object.isRequired,
};
export default mrmEmailField;
