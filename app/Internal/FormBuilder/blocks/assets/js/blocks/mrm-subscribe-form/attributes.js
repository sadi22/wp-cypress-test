const attributes = {
    form_id :{
        type: 'string',
        default: '0'
    },
    form_list_data: {
        type : 'array',
        default: [{
            value: "0",
            label: "Select MRM Form"
        }]
    },
    render_block: {
        type : 'string',
        default : 'Please Select a Form'
    },


};

export default attributes;
