import { useFocusIdx, useEditorProps } from 'easy-email-editor';

import {
    AttributesPanelWrapper,
    ColorPickerField,
    SelectField,
    TextField,
    NumberField
} from 'easy-email-extensions';
import React, {useCallback} from 'react';


const selectCategoryDropdownOptions = window.MRM_Vars.editor_data_source.product_categories

export function Panel() {
    const { focusIdx } = useFocusIdx();
    const { onChangeCategory } = useEditorProps();

    const onFieldValueChange = (value) => {
        onChangeCategory(value)
    }

    return (
        <AttributesPanelWrapper style={{ padding: '20px' }}>
            <div>
                <TextField
                    label='Title'
                    name={`${focusIdx}.data.value.title`}
                    inline
                    alignment='center'
                />
                <SelectField
                    label= 'Select Category'
                    options={selectCategoryDropdownOptions}
                    name={`${focusIdx}.data.value.producttype`}
                    onFieldValueChange={onFieldValueChange}
                />
                <NumberField
                    label='Quantity'
                    inline
                    max={6}
                    name={`${focusIdx}.data.value.quantity`}
                />
                <TextField
                    label='Button text'
                    name={`${focusIdx}.data.value.buttonText`}
                    inline
                    alignment='center'
                />
                <ColorPickerField
                    label='Background color'
                    name={`${focusIdx}.attributes.background-color`}
                    inline
                    alignment='center'
                />
                <ColorPickerField
                    label='Title color'
                    name={`${focusIdx}.attributes.title-color`}
                    inline
                    alignment='center'
                />
                <ColorPickerField
                    label='Product name color'
                    name={`${focusIdx}.attributes.product-name-color`}
                    inline
                    alignment='center'
                />
                <ColorPickerField
                    label='Product price color'
                    name={`${focusIdx}.attributes.product-price-color`}
                    inline
                    alignment='center'
                />
                <ColorPickerField
                    label='Button color'
                    name={`${focusIdx}.attributes.button-color`}
                    inline
                    alignment='center'
                />
                <ColorPickerField
                    label='Button text color'
                    name={`${focusIdx}.attributes.button-text-color`}
                    inline
                    alignment='center'
                />
            </div>
        </AttributesPanelWrapper>
    );
}
