/**
 * External dependencies
 */
import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from "react";
import {__} from "@wordpress/i18n";
const { RawHTML, Component, useEffect, } = wp.element;
const { RichText } = wp.blockEditor;
const {
    withSelect,
    withDispatch,
    useSelect,
    useDispatch
} = wp.data;

/**
 * Internal dependencies
 */

const mrmSubscribeForm = ({
        attributes: {
            render_block,
        },
    }) => {

    return (

        <>
            <div id="popup">
                <div className="mrm guternburg-gorm">
                    <form action="">
                        <div className="post__content" dangerouslySetInnerHTML={{__html: render_block}}></div>
                    </form>
                </div>
            </div>

        </>
    )
}

mrmSubscribeForm.propTypes = {
    attributes: PropTypes.object.isRequired,
};
export default mrmSubscribeForm;
