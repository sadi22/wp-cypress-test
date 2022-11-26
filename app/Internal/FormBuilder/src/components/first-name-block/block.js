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

const mrmFirstName = ({
  attributes: {
    formLayout,
    firstNameLabel,
    firstNamePlaceholder,
    isRequiredName,

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
      <div className="mrm-form-group first-name" style={fieldSpacing}>
        <label htmlFor="mrm-first-name" style={labelStyle}>
          {firstNameLabel}
          {requiredMark && isRequiredName && (
            <span className="required-mark">*</span>
          )}
        </label>

        <div className="input-wrapper">
          <input
            type="text"
            name="first_name"
            id="mrm-first-name"
            placeholder={firstNamePlaceholder}
            required={isRequiredName}
            style={inputStyle}
          />
        </div>
      </div>
    </>
  );
};

mrmFirstName.propTypes = {
  attributes: PropTypes.object.isRequired,
};
export default mrmFirstName;
