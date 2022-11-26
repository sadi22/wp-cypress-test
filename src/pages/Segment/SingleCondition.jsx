import React from 'react'
import { useState } from "react";
import DeleteIcon from '../../components/Icons/Delete'

const SingleCondition = ({ index, conditionsLength, segmentCondition, addCondition, deleteCondition }) => {
    const [conditionDropdown, setConditionDropdown] = useState(false);
    const [fieldTypeDropdown, setFieldTypeDropdown] = useState(false);
    const [fieldConditionDropdown, setFieldConditionDropdown] = useState(false);
    const [fieldActionDropdown, setfieldActionDropdown] = useState(false);

    const showCondition = () => {
        setConditionDropdown(!conditionDropdown);
    };

    const showDropdownOption = (param) => {
        if( 'field-type' == param ){
            setFieldTypeDropdown(!fieldTypeDropdown);
            setFieldConditionDropdown(false);
            setfieldActionDropdown(false);

        }else if( 'field-condition' == param ){
            setFieldTypeDropdown(false);
            setFieldConditionDropdown(!fieldConditionDropdown);
            setfieldActionDropdown(false);

        }else {
            setFieldTypeDropdown(false);
            setFieldConditionDropdown(false);
            setfieldActionDropdown(!fieldActionDropdown);
        }

    };

    const  field_types = segmentCondition.field_type;
    const  field_conditions = segmentCondition.field_condition;
    const  field_actions = segmentCondition.field_action;
    const  field_action_input = segmentCondition.field_action_input;
    const  condition_logic = segmentCondition.condition_logic;

    return (
        <>
            <div className={ conditionsLength > 1 ? "single-condition more-than-one-condition" : "single-condition only-one-condition" }>
                <ul className="single-condition-inner">
                    <li className="single-condition-filed field-type">
                        <div className={ fieldTypeDropdown ? "mrm-custom-select-container show-dropdown" : "mrm-custom-select-container" } >
                            <button className="mrm-custom-select-btn" type="button" onClick={() => showDropdownOption('field-type')} >Select Field Type</button>
                            <ul className="mintmrm-dropdown mrm-custom-select-dropdown">
                                <li value="">Select Field Type</li>

                                {field_types.map((field_type, idx) => {
                                    return (
                                      <li key={idx} value={field_type.field_type_value}>{field_type.field_type_label}</li>
                                    );
                                })}
                            </ul>
                        </div>
                    </li>

                    <li className="single-condition-filed field-condition">
                        <div className={ fieldConditionDropdown ? "mrm-custom-select-container show-dropdown" : "mrm-custom-select-container" } >
                            <button className="mrm-custom-select-btn" type="button" onClick={() => showDropdownOption('field-condition')} >Select Condition</button>
                            <ul className="mintmrm-dropdown mrm-custom-select-dropdown">
                                <li value="">Select Condition</li>
                                
                                {field_conditions.map((field_condition, idx) => {
                                    return (
                                        <li key={idx} value={field_condition.field_condition_value}>{field_condition.field_condition_label}</li>
                                    );
                                })}
                            </ul>
                        </div>
                    </li>

                    <li className="single-condition-filed field-action">
                        <div className={ fieldActionDropdown ? "mrm-custom-select-container show-dropdown" : "mrm-custom-select-container" } >
                            <button className="mrm-custom-select-btn" type="button" onClick={() => showDropdownOption('field-action')} >Select Action</button>
                            <ul className="mintmrm-dropdown mrm-custom-select-dropdown">
                                <li value="">Select Action</li>
                                
                                {field_actions.map((field_action, idx) => {
                                    return (
                                        <li key={idx} value={field_action.field_action_value}>{field_action.field_action_label}</li>
                                    );
                                })}
                            </ul>
                        </div>
                    </li>

                    {conditionsLength > 1&& 
                      <li className="single-condition-filed delete-condition">
                          <button type="button" title="Delete this Condition" onClick={() => deleteCondition(index)}>
                              <DeleteIcon />
                          </button>
                      </li>
                    }
                </ul>

                <div className="condition-repeater">
                    <span className={ conditionDropdown ? "add-condition show-dropdown" : "add-condition" } title="Add Condition" onClick={showCondition}>
                        <svg width="22" height="22" fill="none" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg"><g fill="#573BFF" clip-path="url(#clip0_616_1195)"><path d="M13 0C5.831 0 0 5.831 0 13s5.831 13 13 13 13-5.832 13-13S20.169 0 13 0zm0 23.986C6.943 23.986 2.014 19.058 2.014 13 2.014 6.942 6.944 2.014 13 2.014c6.057 0 10.986 4.928 10.986 10.986 0 6.058-4.928 10.986-10.986 10.986z"/><path d="M18.035 11.902h-4.028V7.875a1.007 1.007 0 10-2.014 0v4.027H7.965a1.007 1.007 0 100 2.014h4.028v4.028a1.007 1.007 0 102.014 0v-4.027h4.028a1.007 1.007 0 100-2.014z"/></g><defs><clipPath id="clip0_616_1195"><path fill="#fff" d="M0 0h26v26H0z"/></clipPath></defs></svg>

                        <ul className="conditions mintmrm-dropdown">
                            <li onClick={() => addCondition('and')}>and</li>
                            <li onClick={() => addCondition('or')}>or</li>
                        </ul>
                    </span>
                </div>

                <div className="condition-symbol">
                  {condition_logic == 'and' &&
                    <span className="symbol-and">&</span>
                  }
                  {condition_logic == 'or' &&
                    <span className="symbol-or">or</span>
                  }
                </div>
            </div>
        </>
    )
}

export default SingleCondition