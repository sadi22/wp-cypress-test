import React from "react";
import classnames from "classnames";
import PropTypes from "prop-types";
import Typography from '../../components/components/Typography';

import { __ } from "@wordpress/i18n";
const { withSelect, withDispatch, useSelect, useDispatch } = wp.data;
const { Component, RawHTML, useEffect, useState } = wp.element;
const { compose } = wp.compose;
const {
  TextControl,
  SelectControl,
  RangeControl,
  TextareaControl,
  Button,
  Panel,
  ToggleControl,
  FormToggle,
  PanelBody,
  RadioGroup,
  RadioControl,
  Radio,
} = wp.components;
const {
  InspectorControls,
  ColorPalette,
  RichText,
  useBlockProps,
  BlockControls,
  BlockAlignmentToolbar,
} = wp.blockEditor;

const { useEntityProp } = wp.coreData;
/**
 * Internal dependencies
 */

class Editor extends Component {
  static propTypes = {
    attributes: PropTypes.object.isRequired,
    isSelected: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    setAttributes: PropTypes.func.isRequired,
  };

  onChangeAttribute = (key, value) => {
    this.props.setAttributes({
      ...this.props.attributes,
      [key]: value,
    });
  };

  onChangePadding = (type, attribute, value) => {
    this.props.setAttributes({
      [attribute]: value,
    });
  };

  selectOptionList = () => {};

  addNewRadioOption = (count) => {
    let { attributes, setAttributes } = this.props;
    const slug_name = this.makeSlug(attributes.field_name);
    setAttributes({ radio_option_count: attributes.radio_option_count + 1 });
    let defaultOption = {
      value: slug_name,
      label: "Label" + "-" + attributes.radio_option_count,
    };
    if ("radio" === attributes.field_type) {
      attributes.radioOption.push(defaultOption);
      setAttributes(attributes.radioOption);
    }
  };

  customFields = () => {
    let { attributes, setAttributes } = this.props;

    return (
      <PanelBody title="Custom Field" className="inner-pannel">
        <SelectControl
          className="mrm-inline-label"
          label="Field Type"
          value={attributes.field_type}
          onChange={(select_type) =>
            this.onChangeAttribute("field_type", select_type)
          }
          options={[
            {
              value: "text",
              label: "Text",
            },
            {
              value: "textarea",
              label: "Text Area",
            },
            {
              value: "radio",
              label: "Radio Button",
            },
            {
              value: "checkbox",
              label: "Checkbox",
            },
            {
              value: "select",
              label: "Select",
            },
            {
              value: "date",
              label: "Date",
            },
          ]}
        />

        <TextControl
          className="mrm-inline-label"
          label="Field Name"
          value={attributes.field_name}
          onChange={(state) => setAttributes({ field_name: state })}
        />

        {attributes.field_type != "radio" && (
          <TextControl
            className="mrm-inline-label"
            label=" Field Label"
            value={attributes.field_label}
            onChange={(state) => setAttributes({ field_label: state })}
          />
        )}

        {attributes.field_type == "textarea" && (
          <TextControl
            className="mrm-inline-label"
            label=" Placeholder Text"
            value={attributes.custom_textarea_placeholder}
            onChange={(state) =>
              setAttributes({ custom_textarea_placeholder: state })
            }
          />
        )}

        {attributes.field_type == "text" && (
          <TextControl
            className="mrm-inline-label"
            label=" Placeholder Text"
            value={attributes.custom_text_placeholder}
            onChange={(state) =>
              setAttributes({ custom_text_placeholder: state })
            }
          />
        )}

        {attributes.field_type == "select" && (
          <div className="select-option-wrapper">
            <div className="add-option-wrapper">
              <h4>Add New Option</h4>
              <button
                onClick={() => {
                  this.addNewOption();
                }}
                className="add-option-button"
                role="button"
                title="Add New Option"
              >
                <svg
                  width="14"
                  height="14"
                  fill="none"
                  viewBox="0 0 14 14"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke="#44af5c"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7.008 1v12M1 7h12"
                  />
                </svg>
              </button>
            </div>

            {attributes.selectOption.map((option, index) => {
              return (
                <div className="single-option-field">
                  <TextControl
                    value={option.value}
                    // onChange={ (state ) => setAttributes({ value: state }) }
                    onChange={(val) =>
                      this.onChangeOptionField(option, val, index)
                    }
                  />
                  <button
                    key={`mrm-delete-button-${index}`}
                    onClick={(val) => this.deleteOption(option, val, index)}
                    className="delete-option-button"
                    title="Delete Option"
                    role="button"
                  >
                    <svg
                      width="18"
                      height="18"
                      fill="none"
                      viewBox="0 0 22 22"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g
                        stroke="#aa646b"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        clip-path="url(#clip0_54_11724)"
                      >
                        <path d="M16.5 5.5l-11 11m0-11l11 11" />
                      </g>
                      <defs>
                        <clipPath id="clip0_54_11724">
                          <path fill="#fff" d="M0 0h22v22H0z" />
                        </clipPath>
                      </defs>
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {attributes.field_type == "radio" && (
          <div className="radio-option-wrapper">
            <div className="add-option-wrapper">
              <h4>Add New Option</h4>
              <button
                onClick={(count) => {
                  this.addNewRadioOption(count);
                }}
                className="add-option-button"
                role="button"
                title="Add New Option"
              >
                <svg
                  width="14"
                  height="14"
                  fill="none"
                  viewBox="0 0 14 14"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke="#44af5c"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7.008 1v12M1 7h12"
                  />
                </svg>
              </button>
            </div>

            {attributes.radioOption.map((option, index) => {
              return (
                <div className="single-option-field">
                  <TextControl
                    value={option.label}
                    // onChange={ (state ) => setAttributes({ value: state }) }
                    onChange={(val) =>
                      this.onChangeRadioLabelField(option, val, index)
                    }
                  />
                  <button
                    key={`mrm-delete-button-${index}`}
                    onClick={(val) =>
                      this.deleteRadioButtonOption(option, val, index)
                    }
                    className="delete-option-button"
                    title="Delete Option"
                    role="button"
                  >
                    <svg
                      width="18"
                      height="18"
                      fill="none"
                      viewBox="0 0 22 22"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g
                        stroke="#aa646b"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        clip-path="url(#clip0_54_11724)"
                      >
                        <path d="M16.5 5.5l-11 11m0-11l11 11" />
                      </g>
                      <defs>
                        <clipPath id="clip0_54_11724">
                          <path fill="#fff" d="M0 0h22v22H0z" />
                        </clipPath>
                      </defs>
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <ToggleControl
          className="mrm-switcher-block"
          label="Mark As Required"
          checked={attributes.field_require}
          onChange={(state) => setAttributes({ field_require: state })}
        />

        <hr className="mrm-hr" />

        <label className="blocks-base-control__label">Row Spacing</label>
        <RangeControl
          value={attributes.rowSpacing}
          onChange={(rowSpacing) =>
            this.onChangeAttribute("rowSpacing", rowSpacing)
          }
          allowReset={true}
          resetFallbackValue={12}
          min={0}
          max={50}
          step={1}
        />

      </PanelBody>
    );
  };

  onChangeRadioValueField = (option, val, index) => {
    const {
      setAttributes,
      attributes: { radioOption },
    } = this.props;
    option.value = val;
    const modifiedOption = radioOption.map((value, thisIndex) => {
      if (index === thisIndex) {
        value = { ...radioOption[index], ...option };
      }
      return value;
    });
    setAttributes({ radioOption: modifiedOption });
  };

  onChangeRadioLabelField = (option, val, index) => {
    const {
      setAttributes,
      attributes: { radioOption },
    } = this.props;
    option.label = val;
    const modifiedOption = radioOption.map((value, thisIndex) => {
      if (index === thisIndex) {
        value = { ...radioOption[index], ...option };
      }
      return value;
    });
    setAttributes({ radioOption: modifiedOption });
  };

  onChangeOptionField = (option, val, index) => {
    const {
      setAttributes,
      attributes: { selectOption },
    } = this.props;
    option.label = val;
    option.value = val;
    const modifiedOption = selectOption.map((value, thisIndex) => {
      if (index === thisIndex) {
        value = { ...selectOption[index], ...option };
      }
      return value;
    });
    setAttributes({ selectOption: modifiedOption });
  };

  deleteOption = (option, val, index) => {
    const { setAttributes, attributes } = this.props;
    if (index > -1) {
      // only splice array when item is found
      delete attributes.selectOption[index];
      // attributes.selectOption.splice(index,1); // 2nd parameter means remove one item only
      setAttributes(attributes.selectOption);
    }
  };

  deleteRadioButtonOption = (option, val, index) => {
    const { setAttributes, attributes } = this.props;
    if (index > -1) {
      // only splice array when item is found
      delete attributes.radioOption[index];
      // attributes.radioOption.splice(index,1); // 2nd parameter means remove one item only
      setAttributes(attributes.radioOption);
    }
  };

  addNewOption = () => {
    let { attributes, setAttributes } = this.props;
    setAttributes({ select_option_count: attributes.select_option_count + 1 });
    let defaultOption = {
      value: "option" + "-" + attributes.select_option_count,
      label: "Option" + "-" + attributes.select_option_count,
    };
    if ("select" === attributes.field_type) {
      attributes.selectOption.push(defaultOption);
      setAttributes(attributes.selectOption);
    }
  };

  formStyle = () => {
    let { attributes, setAttributes } = this.props,
      labelTypography = attributes.labelTypography,
      device = attributes.device;

    return (
      <PanelBody title="Label Style" initialOpen={false}>
        <div className="mrm-block-typography">
          <Typography
            label={__('Typography')}
            value={labelTypography}
            onChange={(value) => setAttributes({ labelTypography: value })}
            disableLineHeight
            device={device}
            onDeviceChange={(value) => setAttributes({ device: value })}
          />
        </div>

        <hr className="mrm-hr" />

        <label className="blocks-base-control__label">Label Color</label>
        <ColorPalette
          onChange={(labelColor) =>
            this.onChangeAttribute("labelColor", labelColor)
          }
          value={attributes.labelColor}
        />

        {"radio" !== attributes.field_type &&
          "checkbox" !== attributes.field_type && (
            <>
              <label className="blocks-base-control__label">
                Label Spacing
              </label>
              <RangeControl
                value={attributes.labelSpacing}
                onChange={(labelSpacing) =>
                  this.onChangeAttribute("labelSpacing", labelSpacing)
                }
                allowReset={true}
                resetFallbackValue={7}
                min={0}
                max={50}
                step={1}
              />
            </>
          )}
        
      </PanelBody>
    );
  };

  inputFieldStyle = () => {
    let { attributes, setAttributes } = this.props,
      inputTypography = attributes.inputTypography,
      device = attributes.device;

    return (
      <PanelBody title="Input Field Style" initialOpen={false}>
        <div className="mrm-block-typography">
          <Typography
            label={__('Typography')}
            value={inputTypography}
            onChange={(value) => setAttributes({ inputTypography: value })}
            disableLineHeight
            device={device}
            onDeviceChange={(value) => setAttributes({ device: value })}
          />
        </div>

        <hr className="mrm-hr" />

        <label className="blocks-base-control__label">Text Color</label>
        <ColorPalette
          onChange={(inputTextColor) =>
            this.onChangeAttribute("inputTextColor", inputTextColor)
          }
          value={attributes.inputTextColor}
        />

        <label className="blocks-base-control__label">Background Color</label>
        <ColorPalette
          onChange={(inputBgColor) =>
            this.onChangeAttribute("inputBgColor", inputBgColor)
          }
          value={attributes.inputBgColor}
        />

        <hr className="mrm-hr" />

        <label className="blocks-base-control__label">Border Radius</label>
        <RangeControl
          value={attributes.inputBorderRadius}
          onChange={(radius) =>
            this.onChangeAttribute("inputBorderRadius", radius)
          }
          allowReset={true}
          resetFallbackValue={5}
          min={0}
          max={100}
          step={1}
        />

        <label className="blocks-base-control__label">Border Style</label>
        <SelectControl
          value={attributes.inputBorderStyle}
          onChange={(inputBorderStyle) =>
            this.onChangeAttribute("inputBorderStyle", inputBorderStyle)
          }
          options={[
            {
              value: "none",
              label: "None",
            },
            {
              value: "solid",
              label: "Solid",
            },
            {
              value: "Dashed",
              label: "dashed",
            },
            {
              value: "Dotted",
              label: "dotted",
            },
            {
              value: "Double",
              label: "double",
            },
          ]}
        />

        <label className="blocks-base-control__label">Border Width</label>
        <RangeControl
          value={attributes.inputBorderWidth}
          onChange={(border) =>
            this.onChangeAttribute("inputBorderWidth", border)
          }
          allowReset={true}
          resetFallbackValue={1}
          min={0}
          max={5}
          step={1}
        />

        <label className="blocks-base-control__label">Border Color</label>
        <ColorPalette
          onChange={(inputBorderColor) =>
            this.onChangeAttribute("inputBorderColor", inputBorderColor)
          }
          value={attributes.inputBorderColor}
        />
        
      </PanelBody>
    );
  };

  getInspectorControls = () => {
    let { attributes, setAttributes } = this.props;

    return (
      <InspectorControls key="mrm-mrm-form-inspector-controls">
        <div
          id="mrm-block-inspected-inspector-control-wrapper"
          className="mrm-block-control-wrapper"
        >
          <Panel>
            {this.customFields()}
            {this.formStyle()}
            {"radio" !== attributes.field_type &&
              "checkbox" !== attributes.field_type &&
              this.inputFieldStyle()}
          </Panel>
        </div>
      </InspectorControls>
    );
  };

  /**
   * Render Text Field
   * @param attributes
   * @returns {JSX.Element}
   */
  renderTextField = (attributes) => {
    const slug_name = this.makeSlug(attributes.field_name);
    this.props.setAttributes({ field_slug: slug_name });
    let fieldSpacing = {
      marginBottom: attributes.rowSpacing + "px",
    };

    let labelStyle = {
      color: attributes.labelColor,
      marginBottom: attributes.labelSpacing + "px",
      fontWeight: attributes.labelTypography.weight,
      fontFamily: attributes.labelTypography.family,
    };

    let checkboxLabelColor = {
      color: attributes.labelColor,
    };

    let inputStyle = {
      backgroundColor: attributes.inputBgColor,
      color: attributes.inputTextColor,
      borderRadius: attributes.inputBorderRadius + "px",
      paddingTop: attributes.inputPaddingTop + "px",
      paddingRight: attributes.inputPaddingRight + "px",
      paddingBottom: attributes.inputPaddingBottom + "px",
      paddingLeft: attributes.inputPaddingLeft + "px",
      borderStyle: attributes.inputBorderStyle,
      borderWidth: attributes.inputBorderWidth + "px",
      borderColor: attributes.inputBorderColor,
      fontWeight: attributes.inputTypography.weight,
      fontFamily: attributes.inputTypography.family,
    };

    return (
      <Fragment>
        <div
          key={`mrm-${attributes.field_label}`}
          className="mrm-form-group"
          style={fieldSpacing}
        >
          <label htmlFor={attributes.field_slug} style={labelStyle}>
            {attributes.field_label
              ? __(attributes.field_label, "mrm")
              : __("", "mrm")}
            {attributes.field_require && (
              <span className="required-mark">*</span>
            )}
          </label>

          <div className="input-wrapper">
            <input
              type="text"
              name={attributes.field_slug}
              id={attributes.field_slug}
              placeholder={attributes.custom_text_placeholder}
              required={attributes.field_require}
              style={inputStyle}
            />
          </div>
        </div>
      </Fragment>
    );
  };

  /**
   * Render Textarea Field
   * @param attributes
   * @returns {JSX.Element}
   */
  renderTextareaField = (attributes) => {
    const slug_name = this.makeSlug(attributes.field_name);
    this.props.setAttributes({ field_slug: slug_name });
    let fieldSpacing = {
      marginBottom: attributes.rowSpacing + "px",
    };

    let labelStyle = {
      color: attributes.labelColor,
      marginBottom: attributes.labelSpacing + "px",
      fontWeight: attributes.labelTypography.weight,
      fontFamily: attributes.labelTypography.family,
    };

    let checkboxLabelColor = {
      color: attributes.labelColor,
    };

    let inputStyle = {
      backgroundColor: attributes.inputBgColor,
      color: attributes.inputTextColor,
      borderRadius: attributes.inputBorderRadius + "px",
      paddingTop: attributes.inputPaddingTop + "px",
      paddingRight: attributes.inputPaddingRight + "px",
      paddingBottom: attributes.inputPaddingBottom + "px",
      paddingLeft: attributes.inputPaddingLeft + "px",
      borderStyle: attributes.inputBorderStyle,
      borderWidth: attributes.inputBorderWidth + "px",
      borderColor: attributes.inputBorderColor,
      fontWeight: attributes.inputTypography.weight,
      fontFamily: attributes.inputTypography.family,
    };
    return (
      <Fragment>
        <div
          key={`mrm-${attributes.field_label}`}
          className="mrm-form-group"
          style={fieldSpacing}
        >
          <label htmlFor={attributes.field_slug} style={labelStyle}>
            {attributes.field_label
              ? __(attributes.field_label, "mrm")
              : __("", "mrm")}
            {attributes.field_require && (
              <span className="required-mark">*</span>
            )}
          </label>

          <div className="input-wrapper">
            <textarea
              id={attributes.field_slug}
              name={attributes.field_slug}
              placeholder={attributes.custom_textarea_placeholder}
              required={attributes.field_require}
              rows="4"
              cols="50"
              style={inputStyle}
            ></textarea>
          </div>
        </div>
      </Fragment>
    );
  };

  /**
   * Render Date Field
   * @param attributes
   * @returns {JSX.Element}
   */
  renderDateField = (attributes) => {
    const slug_name = this.makeSlug(attributes.field_name);
    this.props.setAttributes({ field_slug: slug_name });
    let fieldSpacing = {
      marginBottom: attributes.rowSpacing + "px",
    };

    let labelStyle = {
      color: attributes.labelColor,
      marginBottom: attributes.labelSpacing + "px",
      fontWeight: attributes.labelTypography.weight,
      fontFamily: attributes.labelTypography.family,
    };

    let checkboxLabelColor = {
      color: attributes.labelColor,
    };

    let inputStyle = {
      backgroundColor: attributes.inputBgColor,
      color: attributes.inputTextColor,
      borderRadius: attributes.inputBorderRadius + "px",
      paddingTop: attributes.inputPaddingTop + "px",
      paddingRight: attributes.inputPaddingRight + "px",
      paddingBottom: attributes.inputPaddingBottom + "px",
      paddingLeft: attributes.inputPaddingLeft + "px",
      borderStyle: attributes.inputBorderStyle,
      borderWidth: attributes.inputBorderWidth + "px",
      borderColor: attributes.inputBorderColor,
      fontWeight: attributes.inputTypography.weight,
      fontFamily: attributes.inputTypography.family,
    };
    return (
      <Fragment>
        <div
          key={`mrm-${attributes.field_label}`}
          className="mrm-form-group"
          style={fieldSpacing}
        >
          <label htmlFor={attributes.field_slug} style={labelStyle}>
            {attributes.field_label
              ? __(attributes.field_label, "mrm")
              : __("", "mrm")}
            {attributes.field_require && (
              <span className="required-mark">*</span>
            )}
          </label>

          <div className="input-wrapper">
            <input
              type="date"
              id={attributes.field_slug}
              name={attributes.field_slug}
              required={attributes.field_require}
              style={inputStyle}
            />
          </div>
        </div>
      </Fragment>
    );
  };

  /**
   * Render Select Field
   * @param attributes
   * @returns {JSX.Element}
   */
  renderSelectField = (attributes) => {
    const slug_name = this.makeSlug(attributes.field_name);
    this.props.setAttributes({ field_slug: slug_name });
    let fieldSpacing = {
      marginBottom: attributes.rowSpacing + "px",
    };

    let labelStyle = {
      color: attributes.labelColor,
      marginBottom: attributes.labelSpacing + "px",
      fontWeight: attributes.labelTypography.weight,
      fontFamily: attributes.labelTypography.family,
    };

    let checkboxLabelColor = {
      color: attributes.labelColor,
    };

    let inputStyle = {
      backgroundColor: attributes.inputBgColor,
      color: attributes.inputTextColor,
      borderRadius: attributes.inputBorderRadius + "px",
      paddingTop: attributes.inputPaddingTop + "px",
      paddingRight: attributes.inputPaddingRight + "px",
      paddingBottom: attributes.inputPaddingBottom + "px",
      paddingLeft: attributes.inputPaddingLeft + "px",
      borderStyle: attributes.inputBorderStyle,
      borderWidth: attributes.inputBorderWidth + "px",
      borderColor: attributes.inputBorderColor,
      fontWeight: attributes.inputTypography.weight,
      fontFamily: attributes.inputTypography.family,
    };
    return (
      <Fragment>
        <div
          key={`mrm-${attributes.field_label}`}
          className="mrm-form-group select"
          style={fieldSpacing}
        >
          <label htmlFor={attributes.field_slug} style={labelStyle}>
            {attributes.field_label
              ? __(attributes.field_label, "mrm")
              : __("", "mrm")}
            {attributes.field_require && (
              <span className="required-mark">*</span>
            )}
          </label>

          <div className="input-wrapper">
            <select
              name={attributes.field_slug}
              id={attributes.field_slug}
              style={inputStyle}
            >
              {attributes.selectOption.map((value, index) => {
                return this.renderSelectOption(value, index);
              })}
            </select>
          </div>
        </div>
      </Fragment>
    );
  };

  /**
   * Render Select Option
   * @param option
   * @param index
   * @returns {JSX.Element}
   */
  renderSelectOption = (option, index) => {
    const { attributes, setAttributes } = this.props;
    const slug_name = this.makeSlug(option.value);
    return (
      <Fragment>
        <option value={slug_name}>{option.label}</option>
      </Fragment>
    );
  };

  /**
   * Render checkbox field
   * @returns {JSX.Element}
   */
  renderCheckboxField = (attributes) => {
    const slug_name = this.makeSlug(attributes.field_name);
    this.props.setAttributes({ field_slug: slug_name });

    let fieldSpacing = {
      marginBottom: attributes.rowSpacing + "px",
    };

    // let labelStyle = {
    //     color:  attributes.labelColor,
    //     marginBottom:  attributes.labelSpacing+'px',
    // }

    let checkboxLabelColor = {
      color: attributes.labelColor,
      fontWeight: attributes.labelTypography.weight,
      fontFamily: attributes.labelTypography.family,
    };

    // let inputStyle = {
    //     backgroundColor: attributes.inputBgColor,
    //     color:  attributes.inputTextColor,
    //     borderRadius:  attributes.inputBorderRadius+'px',
    //     paddingTop:  attributes.inputPaddingTop+'px',
    //     paddingRight:  attributes.inputPaddingRight+'px',
    //     paddingBottom:  attributes.inputPaddingBottom+'px',
    //     paddingLeft:  attributes.inputPaddingLeft+'px',
    //     borderStyle:  attributes.inputBorderStyle,
    //     borderWidth:  attributes.inputBorderWidth+'px',
    //     borderColor:  attributes.inputBorderColor,
    // }
    return (
      <Fragment>
        <div
          key={`mrm-${attributes.field_label}`}
          className="mrm-checkbox-group mintmrm-checkbox"
          style={fieldSpacing}
        >
          <input
            type="checkbox"
            id={attributes.field_slug}
            name={attributes.field_slug}
            required={attributes.field_require}
          />
          <label htmlFor={attributes.field_slug} style={checkboxLabelColor}>
            {attributes.field_label
              ? __(attributes.field_label, "mrm")
              : __("", "mrm")}
            {attributes.field_require && (
              <span className="required-mark">*</span>
            )}
          </label>
        </div>
      </Fragment>
    );
  };

  renderRadioOption = (option, index, field_slug) => {
    const { attributes, setAttributes } = this.props;
    let fieldSpacing = {
      //color:  attributes.labelColor,
      marginBottom: attributes.rowSpacing + "px",
    };

    let labelStyle = {
      color: attributes.labelColor,
      fontWeight: attributes.labelTypography.weight,
      fontFamily: attributes.labelTypography.family,
      //marginBottom:  attributes.labelSpacing+'px',
    };

    // let inputStyle = {
    //     backgroundColor: attributes.inputBgColor,
    //     color:  attributes.inputTextColor,
    //     borderRadius:  attributes.inputBorderRadius+'px',
    //     paddingTop:  attributes.inputPaddingTop+'px',
    //     paddingRight:  attributes.inputPaddingRight+'px',
    //     paddingBottom:  attributes.inputPaddingBottom+'px',
    //     paddingLeft:  attributes.inputPaddingLeft+'px',
    //     borderStyle:  attributes.inputBorderStyle,
    //     borderWidth:  attributes.inputBorderWidth+'px',
    //     borderColor:  attributes.inputBorderColor,
    // }
    return (
      <div className="mrm-radio-group mintmrm-radiobtn" style={fieldSpacing}>
        <input
          type="radio"
          id={option.label}
          name={field_slug}
          required={attributes.field_require}
        />
        <label key={index} htmlFor={option.label} style={labelStyle}>
          {option.label ? __(option.label, "mrm") : __("", "mrm")}
          {attributes.field_require && <span className="required-mark">*</span>}
        </label>
      </div>
    );
  };

  renderRadioField = (attributes) => {
    const slug_name = this.makeSlug(attributes.field_name);
    this.props.setAttributes({ field_slug: slug_name });
    return (
      <Fragment>
        <div
          key={`mrm-${attributes.field_label}`}
          className="mrm-form-group radio"
        >
          {attributes.radioOption.map((option, index) => {
            return this.renderRadioOption(
              option,
              index,
              this.props.attributes.field_slug
            );
          })}
        </div>
      </Fragment>
    );
  };
  /**
   * Make Slug when render text
   * @param values
   * @returns {string}
   */
  makeSlug = (values) => {
    const slug = values.toLowerCase().replace(/[\W_]+/g, "-");
    return slug;
  };
  render() {
    const { attributes, setAttributes } = this.props;
    return (
      <>
        {this.getInspectorControls()}
        {attributes.field_type == "text" && (
          <div>{this.renderTextField(attributes)}</div>
        )}
        {attributes.field_type == "textarea" && (
          <div>{this.renderTextareaField(attributes)}</div>
        )}
        {attributes.field_type == "date" && (
          <div>{this.renderDateField(attributes)}</div>
        )}
        {attributes.field_type == "select" && (
          <div>{this.renderSelectField(attributes)}</div>
        )}
        {attributes.field_type == "checkbox" && (
          <div>{this.renderCheckboxField(attributes)}</div>
        )}
        {attributes.field_type == "radio" && (
          <div>{this.renderRadioField(attributes)}</div>
        )}
      </>
    );
  }
}

export default compose([])(Editor);
