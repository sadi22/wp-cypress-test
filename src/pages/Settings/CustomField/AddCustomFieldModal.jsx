import React, { useRef, useState, useEffect } from "react";

import CrossIcon from "../../../components/Icons/CrossIcon";
import TooltipQuestionIcon from "../../../components/Icons/TooltipQuestionIcon";

export default function AddCustomFieldModal(props) {
  const {
    addNewCustomField,
    closeCustomFieldModal,
    prepareData,
    setPrepareData,
  } = props;
  const [customFieldType, setCustomFieldType] = useState();
  const [customFieldLabel, setCustomFieldLabel] = useState();
  const [customFieldSlug, setCustomFieldSlug] = useState();
  const [newDropdownOption, setNewDropdownOption] = useState([]);
  const [optionArray, setOptionsArray] = useState([]);
  /**
   * Make Slug when render text
   * @param values
   * @returns {string}
   */
  const makeSlug = (values) => {
    const slug = values.toLowerCase().replace(/[\W_]+/g, "-");
    return slug;
  };
  const [customFieldData, setCustomFieldData] = useState([]);

  //----get field type from selectbox-----
  const selectFieldType = (event) => {
    setCustomFieldType(event.target.value);
  };

  const handleChange = (event) => {
    setCustomFieldData({
      ...customFieldData,
      [event.target.name]: event.target.value,
    });
    setCustomFieldSlug(makeSlug(event.target.value));
  };

  useEffect(() => {
    setPrepareData({
      title: customFieldData.fieldName,
      slug: customFieldData.newFieldSlug,
      type: customFieldType,
      label: customFieldData.fieldLabel,
      placeholder: customFieldData.fieldPlaceholder,
      options: optionArray,
      required: customFieldData.isRequired,
      checked: customFieldData.checkedStatus,
    });
  }, [customFieldData, customFieldType, optionArray]);

  //----get custom new label field value-----
  const getFieldLabelValue = (event) => {
    setCustomFieldLabel(event.target.value);
    setCustomFieldSlug(makeSlug(event.target.value));
  };

  //----get custom new slug field value-----
  const getFieldSlugValue = (event) => {
    setCustomFieldSlug(makeSlug(event.target.value));
  };

  //----add new option repeater-----
  const addNewOption = () => {
    setNewDropdownOption((prevState) => {
      return [
        ...prevState,
        {
          label: "",
        },
      ];
    });
  };

  const handleOptionChange = (option, e, idx) => {
    setOptionsArray({...optionArray, [e.target.name]: e.target.value});
  };

  const handleOptionRemove = () => {
    console.log("delete option");
  };

  return (
    <>
      <div className="custom-field-modal-inner">
        <div className="modal-content-wrapper">
          <button
            type="button"
            className="close-modal"
            onClick={closeCustomFieldModal}
          >
            <CrossIcon />
          </button>
          <div className="modal-body">
            <h4 className="modal-title">Add Custom Field</h4>

            <div className="form-group">
              <label htmlFor="custom-field-name">Field Name</label>
              <input
                type="text"
                name="fieldName"
                id="custom-field-name"
                placeholder="Enter field name"
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="custom-field-type">Field Type</label>
              <select
                name="field-type"
                id="custom-field-type"
                onChange={selectFieldType}
              >
                <option value="">Select field type</option>
                <option value="text">Text field</option>
                <option value="textArea">Multiline text field</option>
                <option value="number">Number field</option>
                {/* <option value="email-field">Email field</option> */}
                <option value="selectField">Select dropdown</option>
                <option value="radioField">Radio</option>
                {/* <option value="checkboxField">Checkbox</option> */}
              </select>
            </div>

            {(customFieldType === "text" ||
              customFieldType === "textArea" ||
              customFieldType === "number" ||
              customFieldType === "email-field") && (
              <div className="new-field-wrapper">
                <div className="form-group">
                  <label>Label</label>
                  <input
                    type="text"
                    name="fieldLabel"
                    placeholder="Enter field Label"
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>
                    Slug (Optional)
                    <span class="mintmrm-tooltip">
                      <TooltipQuestionIcon />
                      <p>
                        {" "}
                        Must enter an email where will a reply will be received{" "}
                      </p>
                    </span>
                  </label>
                  <input
                    type="text"
                    name="newFieldSlug"
                    placeholder="Enter custom field slug"
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Placeholder Text</label>
                  <input
                    type="text"
                    name="fieldPlaceholder"
                    placeholder="Enter placeholder text"
                    onChange={handleChange}
                  />
                </div>

                {/* <div className="form-group">
                  <span className="mintmrm-checkbox">
                    <input
                      id="is-required"
                      type="checkbox"
                      name="isRequired"
                      onChange={handleChange}
                    />
                    <label for="is-required"> Mark as Required </label>
                  </span>
                </div> */}
              </div>
            )}

            {(customFieldType === "selectField" ||
              customFieldType === "radioField" ||
              customFieldType === "checkboxField") && (
              <div className="new-field-wrapper">
                <div className="form-group">
                  <label>Label</label>
                  <input
                    type="text"
                    name="fieldLabel"
                    placeholder="Enter field Label"
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>
                    Slug (Optional)
                    <span class="mintmrm-tooltip">
                      <TooltipQuestionIcon />
                      <p>
                        {" "}
                        Must enter an email where will a reply will be received{" "}
                      </p>
                    </span>
                  </label>
                  <input
                    type="text"
                    name="newFieldSlug"
                    placeholder="Enter custom field slug"
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group field-options">
                  <div className="option-header">
                    <label>Add New Option</label>
                    <button className="mintmrm-btn" onClick={addNewOption}>
                      <svg
                        width="13"
                        height="13"
                        fill="none"
                        viewBox="0 0 13 13"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke="#fff"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M6.508 1v11M1 6.5h11"
                        />
                      </svg>
                      New Option
                    </button>
                  </div>

                  <div className="option-body">
                    {newDropdownOption?.map((option, idx) => {
                      return (
                        <div className="single-option" key={idx}>
                          <input
                            type="text"
                            name={idx}
                            onChange={(e) => handleOptionChange(option, e, idx)}
                          />
                          <button
                            className="delete-option"
                            onClick={handleOptionRemove}
                          >
                            <CrossIcon />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* <div className="form-group">
                  <span className="mintmrm-checkbox">
                    <input id="is-required" type="checkbox" />
                    <label for="is-required"> Mark as Required </label>
                  </span>
                </div> */}
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="mintmrm-btn outline"
              onClick={closeCustomFieldModal}
            >
              Cancel
            </button>
            <button
              type="button"
              className="mintmrm-btn"
              onClick={addNewCustomField}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
