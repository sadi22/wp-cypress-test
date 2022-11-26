const attributes = {
    field_type: {
        type: 'string',
        default: 'text'
    },
    field_name: {
        type: 'string',
        default: ''
    },
    field_label: {
        type: 'string',
        default: ''
    },
    custom_text_placeholder: {
        type: 'string',
        default: ''
    },
    custom_textarea_placeholder: {
        type: 'string',
        default: 'Type here...'
    },
    field_require: {
        type: 'boolean',
        default: false
    },
    create_button: {
        type: 'boolean',
        default: true
    },
    field_slug:{
        type : 'string',
        default: ''
    },
    selectOption: {
        type : 'array',
        default: [
            {
                value: 'none',
                label: '--Select--'
            },
        ]
    },
    select_option_count: {
        type : 'number',
        default : 2
    },
    select_option_name:{
        type : 'string',
        default: ''
    },
    select_option_name_slug:{
        type : 'string',
        default: ''
    },
    radioOption: {
        type : 'array',
        default: [
            {
                label : 'Label',
                value : ''
            }
        ]
    },
    radio_option_count: {
        type : 'number',
        default : 2
    },
    radio_option_name:{
        type : 'string',
        default: ''
    },

    formLayout: {
        type: 'string',
        default: ''
    },
    firstName: {
        type: 'boolean',
        default: false
    },
    firstNameLabel: {
        type: 'string',
        default: 'First Name'
    },
    firstNamePlaceholder: {
        type: 'string',
        default: 'First Name'
    },
    isRequiredName: {
        type: 'boolean',
        default: false
    },

    inputFieldIcon: {
        type: 'boolean',
        default: true
    },
    fieldLabel: {
        type: 'boolean',
        default: false
    },
    requiredMark: {
        type: 'boolean',
        default: true
    },

    rowSpacing: {
        type: 'number',
        default: 12
    },

    labelTypography:{
        type: 'object',
        default: {},
        style: [
            { selector: '.wpfnl-optin-form .wpfnl-optin-form-group > label' }
        ]
    },
    labelColor: {
        type: 'string',
        default: '#363B4E'
    },
    labelSpacing: {
        type: 'number',
        default: 7
    },

    inputTypography:{
        type: 'object',
        default: {},
        style: [
            { selector: '.wpfnl-optin-form .wpfnl-optin-form-group input[type=text], .wpfnl-optin-form .wpfnl-optin-form-group input[type=email]' }
        ]
    },
    device:{
        type: 'string',
        default: 'md'
    },
    inputTextColor: {
        type: 'string',
        default: '#7A8B9A'
    },
    inputBgColor: {
        type: 'string',
        default: '#ffffff'
    },
    inputBorderRadius: {
        type: 'number',
        default: 5
    },
    inputPaddingTop: {
        type: 'integer',
        default: 11,
    },
    inputPaddingRight: {
        type: 'integer',
        default: 14,
    },
    inputPaddingBottom: {
        type: 'integer',
        default: 11,
    },
    inputPaddingLeft: {
        type: 'integer',
        default: 14,
    },
    inputBorderStyle: {
        type: 'string',
        default: 'solid'
    },
    inputBorderWidth: {
        type: 'number',
        default: 1
    },
    inputBorderColor: {
        type: 'string',
        default: '#DFE1E8'
    },

};

export default attributes;
