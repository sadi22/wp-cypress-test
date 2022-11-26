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
 * Make Slug when render text
 * @param values
 * @returns {string}
 */

const makeSlug = (values) => {
  const slug = values.toLowerCase().replace(/[\W_]+/g, "-");
  return slug;
};

const mrmCustomField = ({
  attributes: {
    field_type,
    field_name,
    field_label,
    field_require,
    selectOption,
    select_option_name_slug,
    custom_text_placeholder,
    custom_textarea_placeholder,
    radioOption,
    field_slug,
    rowSpacing,
    labelColor,
    labelSpacing,
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
    inputTypography,
    labelTypography,
  },
}) => {
  let fieldSpacing = {
    marginBottom: rowSpacing + "px",
  };

  let labelStyle = {
    color: labelColor,
    marginBottom: labelSpacing + "px",
    fontWeight: labelTypography.weight,
    fontFamily: labelTypography.family,
  };

  let radioLabelColor = {
    color: labelColor,
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
      {field_type == "text" && (
        <div className="mrm-form-group text" style={fieldSpacing}>
          <label htmlFor={field_name} style={labelStyle}>
            {field_label ? __(field_label, "mrm") : ""}
            {field_require && <span className="required-mark">*</span>}
          </label>

          <div className="input-wrapper">
            <input
              type="text"
              name={field_name}
              id={field_name}
              placeholder={custom_text_placeholder}
              required={field_require}
              style={inputStyle}
            />
          </div>
        </div>
      )}

      {field_type == "textarea" && (
        <div className="mrm-form-group textarea" style={fieldSpacing}>
          <label htmlFor={field_slug} style={labelStyle}>
            {field_label ? __(field_label, "mrm") : __("", "mrm")}
            {field_require && <span className="required-mark">*</span>}
          </label>

          <div className="input-wrapper">
            <textarea
              id={field_slug}
              name={field_slug}
              placeholder={custom_textarea_placeholder}
              required={field_require}
              rows="4"
              cols="50"
              style={inputStyle}
            ></textarea>
          </div>
        </div>
      )}

      {field_type == "date" && (
        <div className="mrm-form-group date" style={fieldSpacing}>
          <label htmlFor={field_name} style={labelStyle}>
            {field_label ? __(field_label, "mrm") : ""}
            {field_require && <span className="required-mark">*</span>}
          </label>

          <div className="input-wrapper">
            <input
              type="date"
              name={field_name}
              id={field_name}
              placeholder={field_name}
              required={field_require}
              style={inputStyle}
            />
          </div>
        </div>
      )}

      {field_type == "radio" && (
        <div key={`mrm-${field_label}`} className="mrm-form-group radio">
          {radioOption.map((option, index) => {
            return (
              <div
                className="mrm-radio-group mintmrm-radiobtn"
                style={fieldSpacing}
              >
                <input
                  key={index}
                  type="radio"
                  id={option.label}
                  name={field_slug}
                  required={field_require}
                />
                <label htmlFor={option.label} style={radioLabelColor}>
                  {option.label ? __(option.label, "mrm") : __("", "mrm")}
                  {field_require && <span className="required-mark">*</span>}
                </label>
              </div>
            );
          })}
        </div>
      )}

      {field_type == "checkbox" && (
        <div className="mrm-form-group checkbox">
          <div
            key={`mrm-${field_label}`}
            className="mrm-checkbox-group mintmrm-checkbox"
            style={fieldSpacing}
          >
            <input
              type="checkbox"
              id={field_slug}
              name={field_slug}
              required={field_require}
              style={inputStyle}
            />
            <label htmlFor={field_slug} style={checkboxLabelColor}>
              {field_label ? __(field_label, "mrm") : __("", "mrm")}
              {field_require && <span className="required-mark">*</span>}
            </label>
          </div>
        </div>
      )}

      {field_type == "select" && (
        <div
          key={`mrm-${field_label}`}
          className="mrm-form-group select"
          style={fieldSpacing}
        >
          <label htmlFor={field_slug} style={labelStyle}>
            {field_label ? __(field_label, "mrm") : __("", "mrm")}
            {field_require && <span className="required-mark">*</span>}
          </label>

          <div className="input-wrapper">
            <select name={field_slug} id={field_slug} style={inputStyle}>
              {selectOption.map((option, index) => {
                return (
                  <option key={index} value={makeSlug(option.value)}>
                    {option.label}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      )}
    </>
  );
};

mrmCustomField.propTypes = {
  attributes: PropTypes.object.isRequired,
};
export default mrmCustomField;
