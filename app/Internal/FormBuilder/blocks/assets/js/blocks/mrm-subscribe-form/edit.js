import React from "react";
import classnames from 'classnames';
import PropTypes from 'prop-types';

import {__} from "@wordpress/i18n";
const {
    withSelect,
    withDispatch,
    useSelect,
    useDispatch
} = wp.data;
const {
    Component,
    RawHTML,
    useEffect,
    useState
} = wp.element;
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
    BlockAlignmentToolbar
} = wp.blockEditor;

const {useEntityProp} = wp.coreData;
/**
 * Internal dependencies
 */


class Editor extends Component {

    static propTypes = {
        attributes      : PropTypes.object.isRequired,
        isSelected      : PropTypes.bool.isRequired,
        name            : PropTypes.string.isRequired,
        setAttributes   : PropTypes.func.isRequired,
    };
    componentDidMount() {
        wp.apiFetch( { path : 'mrm/v1/forms/form-list' } ).then( response => {
            const form_list = response.data;
            this.props.setAttributes({form_list_data: form_list});
        } );
    }
    onChangeAttribute = (key, value) => {
        this.props.setAttributes({
            ...this.props.attributes,
            [key]: value
        });

        this.props.setAttributes({
            form_id: value
        });
        let that =this;
        jQuery.ajax({
                url: window.getwpf_block_object.ajaxUrl,
                type: "POST",
                data: {
                    action          	: 'show_form_markup',
                    post_id         	: value,
                },
                // dataType: 'json',
                success: function (response) {
                    that.props.setAttributes({ render_block : response })
                }
            });


    }
    customFields = () =>{
        let { attributes, setAttributes } 	= this.props;

        return (
            <PanelBody title="Form List" className="inner-pannel">
                <SelectControl
                    label="Form Name"
                    value={attributes.form_id}
                    onChange={ id => this.onChangeAttribute( 'form_id', id )}
                    options={attributes.form_list_data}
                />
            </PanelBody>
        )
    }
    getInspectorControls = () => {
        return (
            <InspectorControls key="mrm-mrm-form-inspector-controls">
                <div id="mrm-block-inspected-inspector-control-wrapper">
                    <Panel>
                        {this.customFields()}
                    </Panel>
                </div>
            </InspectorControls>
        );
    };

    makeSlug = (values) =>{
        const slug =  values.toLowerCase().replace(/[\W_]+/g, "-");
        return slug
    }
    render() {
        const {
            attributes,
            setAttributes
        } = this.props;
        return (

            <>
                { this.getInspectorControls() }
                {attributes.form_list_data.length == 1 &&

                    <div className="mintmrm">
                        <p>No form added</p>
                    </div>
                }
                {attributes.form_list_data.length != 1 && <div className="mintmrm">
                    <form action="">
                        <div className="post__content" dangerouslySetInnerHTML={{__html: attributes.render_block}}></div>
                    </form>
                </div>
                }
                {attributes.form_id == '0' && attributes.form_list_data.length != 1 &&  <SelectControl
                    label="Form Name"
                    value={attributes.form_id}
                    onChange={ id => this.onChangeAttribute( 'form_id', id )}
                    options={attributes.form_list_data}
                />}

                

            </>


        );
    }
}

export default compose( [
] )( Editor );
