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

const mrmLastName = ({
  attributes: {
    formLayout,
    lastNameLabel,
    lastNamePlaceholder,
    isRequiredLastName,

    fieldLabel,
    requiredMark,
    inputBgColor,
    inputTextColor,
    inputBorderRadius,
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

    labelTypography,
    inputTypography,
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
      <div className="mrm-form-group last-name" style={fieldSpacing}>
        <label htmlFor="wpfnl-last-name" style={labelStyle}>
          {lastNameLabel}
          {requiredMark && isRequiredLastName && (
            <span className="required-mark">*</span>
          )}
        </label>

        <div className="input-wrapper">
          <input
            type="text"
            name="last_name"
            id="wpfnl-last-name"
            placeholder={lastNamePlaceholder}
            required={isRequiredLastName}
            style={inputStyle}
          />
        </div>
      </div>
    </>
  );
};

mrmLastName.propTypes = {
  attributes: PropTypes.object.isRequired,
};
export default mrmLastName;
