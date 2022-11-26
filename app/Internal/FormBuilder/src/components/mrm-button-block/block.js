/**
 * External dependencies
 */
import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from "react";
import {__} from "@wordpress/i18n";
const { RawHTML, Component, useEffect, } = wp.element;
const { RichText } = wp.blockEditor;


/**
 * Internal dependencies
 */


const mrmButton = ({
        attributes: {
            formLayout,
            buttonAlign,
            buttonText,
            rowSpacing,
            buttonTextColor,
            buttonBgColor,
            buttonBorderRadius,
            buttonPaddingTop,
            buttonPaddingRight,
            buttonPaddingBottom,
            buttonPaddingLeft,
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
            paddingLeftRight
        },
    }) => {

    let layout = formLayout
    let fieldSpacing = {
        marginBottom:  rowSpacing+'px',
        textAlign : buttonAlign
    }

    let buttonStyle = {
        // backgroundColor: buttonBgColor,
        backgroundColor: outline === 'fill' ? buttonBgColor : 'transparent',
        color:  buttonTextColor,
        borderRadius:  buttonBorderRadius+'px',
        padding: ""+paddingTopBottom+"px "+paddingLeftRight+"px",
        lineHeight : lineHeight,
        letterSpacing :letterSpacing,
        borderStyle:  buttonBorderStyle,
        fontWeight: typography.weight,
        fontFamily: typography.family,
        fontSize : buttonFontSize,
        // textAlign: buttonAlign,
        // borderWidth:  buttonBorderWidth+'px',
        borderWidth: outline === 'fill' ? '0' : buttonBorderWidth+'px',
        borderColor:  buttonBorderColor,
        width : buttonWidth+"%"
    }

    return (
        <>
            <div className="mrm-form-group submit" style={fieldSpacing}>
                <RichText.Content
                    className='mrm-submit-button mintmrm-btn'
                    tagName="button"
                    type="submit"
                    style={ buttonStyle }
                    value={ buttonText }
                />
            </div>
        </>
    )
}

mrmButton.propTypes = {
    attributes: PropTypes.object.isRequired,
};
export default mrmButton;
