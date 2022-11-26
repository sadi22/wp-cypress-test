import PropTypes from "prop-types";
import React from "react";
import Typography from "../../components/components/Typography";

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
  FontSizePicker,
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
  onChangeOutlineStyle = (outline, onChangeOutlineStyle) => {
    this.props.setAttributes({
      outline: onChangeOutlineStyle,
      buttonBorderStyle: "solid",
      buttonTextColor: "#573bff",
      buttonBorderColor: "#573bff",
    });
  };

  onChangePadding = (type, attribute, value) => {
    this.props.setAttributes({
      [attribute]: value,
    });
  };
  buttonText = () => {
    let { attributes, setAttributes } = this.props;

    return (
      <PanelBody title="Button Text" className="inner-pannel">
        <TextControl
          className="mrm-inline-label"
          label="Button Text"
          value={attributes.buttonText}
          onChange={(state) => setAttributes({ buttonText: state })}
        />
      </PanelBody>
    );
  };

  buttonStyle = () => {
    let { attributes, setAttributes } = this.props;
    let typography = attributes.typography,
      device = attributes.device;
    return (
      <PanelBody title="Button Style" initialOpen={false}>
        <div className="mrm-block-typography">
          <Typography
            label={__("Typography")}
            value={typography}
            onChange={(value) => setAttributes({ typography: value })}
            disableLineHeight
            device={device}
            onDeviceChange={(value) => setAttributes({ device: value })}
          />
        </div>

        <hr className="mrm-hr" />

        <label className="blocks-base-control__label">Text Color</label>
        <ColorPalette
          onChange={(buttonTextColor) =>
            this.onChangeAttribute("buttonTextColor", buttonTextColor)
          }
          value={attributes.buttonTextColor}
        />

        <label className="blocks-base-control__label">Background Color</label>
        <ColorPalette
          onChange={(buttonBgColor) =>
            this.onChangeAttribute("buttonBgColor", buttonBgColor)
          }
          value={attributes.buttonBgColor}
        />

        <RangeControl
          label={__("Font size", "mrm")}
          value={attributes.buttonFontSize}
          onChange={(btnBorder) =>
            this.onChangeAttribute("buttonFontSize", btnBorder)
          }
          allowReset={true}
          resetFallbackValue={15}
          min={0}
          max={100}
          step={1}
        />
        <RangeControl
          label={__("Line Height", "mrm")}
          value={attributes.lineHeight}
          onChange={(btn_lineHeight) =>
            setAttributes({ lineHeight: btn_lineHeight })
          }
          allowReset={true}
          resetFallbackValue={1}
          min={0}
          max={100}
          step={1}
        />
        <RangeControl
          label={__("Letter Spacing", "mrm")}
          value={attributes.letterSpacing}
          onChange={(btn_letterSpacing) =>
            setAttributes({ letterSpacing: btn_letterSpacing })
          }
          allowReset={true}
          resetFallbackValue={0}
          min={0}
          max={20}
          step={1}
        />
        <hr className="mrm-hr" />

        <label className="blocks-base-control__label">Border Radius</label>
        <RangeControl
          value={attributes.buttonBorderRadius}
          onChange={(btnRadius) =>
            this.onChangeAttribute("buttonBorderRadius", btnRadius)
          }
          allowReset={true}
          resetFallbackValue={5}
          min={0}
          max={100}
          step={1}
        />

        <label className="blocks-base-control__label">Border Style</label>
        <SelectControl
          value={attributes.buttonBorderStyle}
          onChange={(buttonBorderStyle) =>
            this.onChangeAttribute("buttonBorderStyle", buttonBorderStyle)
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
        <SelectControl
          label={__("Button Outline Style", "mrm")}
          value={attributes.outline}
          onChange={(outline_style) =>
            this.onChangeOutlineStyle("outline", outline_style)
          }
          options={[
            { value: "fill", label: "Fill" },
            { value: "outline", label: "Outline" },
          ]}
        />
        <label className="blocks-base-control__label">Button Width</label>
        <RangeControl
          value={attributes.buttonWidth}
          onChange={(buttonWidth) =>
            this.onChangeAttribute("buttonWidth", buttonWidth)
          }
          allowReset={true}
          resetFallbackValue={20}
          min={0}
          max={100}
          step={10}
        />

        <label className="blocks-base-control__label">Border Width</label>
        <RangeControl
          value={attributes.buttonBorderWidth}
          onChange={(btnBorder) =>
            this.onChangeAttribute("buttonBorderWidth", btnBorder)
          }
          allowReset={true}
          resetFallbackValue={1}
          min={0}
          max={5}
          step={1}
        />

        <label className="blocks-base-control__label">Border Color</label>
        <ColorPalette
          onChange={(buttonBorderColor) =>
            this.onChangeAttribute("buttonBorderColor", buttonBorderColor)
          }
          value={attributes.buttonBorderColor}
        />

        <RangeControl
          label={__("Padding Top & Bottom", "wpfnl")}
          value={attributes.paddingTopBottom}
          onChange={(btn_padding_top_bottom) =>
            setAttributes({ paddingTopBottom: btn_padding_top_bottom })
          }
          allowReset={true}
          resetFallbackValue={15}
          min={0}
          max={100}
          step={1}
        />
        <RangeControl
          label={__("Padding Left & Right", "mrm")}
          value={attributes.paddingLeftRight}
          onChange={(btn_padding_left_right) =>
            setAttributes({ paddingLeftRight: btn_padding_left_right })
          }
          allowReset={true}
          resetFallbackValue={15}
          min={0}
          max={100}
          step={1}
        />
      </PanelBody>
    );
  };
  getInspectorControls = () => {
    return (
      <InspectorControls key="mrm-mrm-form-inspector-controls">
        <div
          id="mrm-block-inspected-inspector-control-wrapper"
          className="mrm-block-control-wrapper"
        >
          <Panel>
            {this.buttonText()}
            {this.buttonStyle()}
          </Panel>
        </div>
      </InspectorControls>
    );
  };

  render() {
    const {
      attributes: {
        buttonText,
        buttonAlign,
        rowSpacing,
        buttonTextColor,
        buttonBgColor,
        buttonBorderRadius,
        buttonBorderStyle,
        buttonBorderWidth,
        buttonBorderColor,
        outline,
        buttonWidth,
        typography,
        buttonFontSize,
        lineHeight,
        letterSpacing,
        paddingTopBottom,
        paddingLeftRight,
      },
    } = this.props;

    let fieldSpacing = {
      marginBottom: rowSpacing + "px",
      textAlign: buttonAlign,
    };
    let buttonStyle = {
      // backgroundColor: buttonBgColor,
      backgroundColor: outline === "fill" ? buttonBgColor : "transparent",
      color: buttonTextColor,
      borderRadius: buttonBorderRadius + "px",
      padding: "" + paddingTopBottom + "px " + paddingLeftRight + "px",
      lineHeight: lineHeight,
      letterSpacing: letterSpacing,
      borderStyle: buttonBorderStyle,
      fontWeight: typography.weight,
      fontFamily: typography.family,
      fontSize: buttonFontSize,
      // textAlign: buttonAlign,
      // borderWidth:  buttonBorderWidth+'px',
      borderWidth: outline === "fill" ? "0" : buttonBorderWidth + "px",
      borderColor: buttonBorderColor,
      width: buttonWidth + "%",
    };

    // display the map selector
    return (
      <>
        {this.getInspectorControls()}

        <div className="mrm-form-group submit" style={fieldSpacing}>
          <BlockControls>
            <BlockAlignmentToolbar
              value={buttonAlign}
              onChange={(newAlign) =>
                this.props.setAttributes({ buttonAlign: newAlign })
              }
              controls={["left", "center", "right"]}
            />
          </BlockControls>
          <RichText
            className="mrm-submit-button mintmrm-btn"
            tagName="p"
            type="button"
            value={buttonText}
            style={buttonStyle}
            onChange={(content) =>
              this.props.setAttributes({ buttonText: content })
            }
            placeholder={__("Submit", "mrm")}
          />
        </div>
      </>
    );
  }
}

export default compose([])(Editor);
