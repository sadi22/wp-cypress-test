import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  submitCustomFields,
  updateCustomFields,
} from "../../services/CustomField";
import DynamicInput from "../DynamicInput";
import InputItem from "../InputItem";
import "./style.css";

export default function CustomFieldCreate() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  // Dynamic input fields hide or show
  const [isShow, setIsShow] = useState(false);

  // Set options value for category field
  const [options, setOptions] = useState([]);

  // Set validation error messages
  const [errors, setErrors] = useState({});
  const [isEdit, setIsEdit] = useState(false);

  // Prepare contact object
  const [customFields, setCustomFields] = useState({
    title: "",
    type: "",
    options: [],
    group_id: 1,
  });

  useEffect(() => {
    async function getData() {
      const res = await fetch(
        `${window.MRM_Vars.api_base_url}mrm/v1/custom-fields/${id}`
      );
      const resJson = await res.json();
      if (resJson.code == 200) {
        setCustomFields(resJson.data);
      }
    }

    if (id) {
      setIsEdit(true);
      getData();
    }
  }, [id]);

  // Set custom fields type
  const onSelect = async (event) => {
    const { name, value } = event.target;

    if ("category" == value.toString()) {
      setIsShow(true);
    } else {
      setIsShow(false);
    }
    setCustomFields((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Set options value which fetching from child component
  const handleOptionData = async (options) => {
    setOptions(options);
  };

  // Set custom fields title
  const handleChange = async (event) => {
    event.persist();
    const { name, value } = event.target;

    setCustomFields((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Custom fields create form submit
  const handleSubmit = async (event) => {
    if (event) event.preventDefault();
    customFields.options = options;

    const res = !isEdit
      ? submitCustomFields(customFields).then((response) => {
          if (201 === response.code) {
            // Navigate user with success message
            navigate("../custom-fields", {
              state: { status: "field-created", message: response?.message },
            });
          } else {
            // Validation messages
            if (200 == response.code) {
              setErrors({
                ...errors,
                title: response?.message,
              });
            } else {
              setErrors({
                ...errors,
                type: response?.message,
              });
            }
          }
        })
      : updateCustomFields(customFields).then((response) => {
          if (201 === response.code) {
            // Navigate user with success message
            navigate("../custom-fields", {
              state: { status: "field-created", message: response?.message },
            });
          } else {
            // Validation messages
            if (200 == response.code) {
              setErrors({
                ...errors,
                title: response?.message,
              });
            } else {
              setErrors({
                ...errors,
                type: response?.message,
              });
            }
          }
        });
  };

  const routeChange = () => {
    let path = `../custom-fields`;
    navigate(path);
  };

  return (
    <div className="create-contact">
      <div className="contact-container">
        <h2 className="conatct-heading">
          {!isEdit ? "Add Custom Field" : "Update Custom Field"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="add-contact-form">
            <div className="contact-form-body">
              <InputItem
                label="Title"
                name="title"
                error={errors?.title}
                value={customFields.title}
                handleChange={handleChange}
                isRequired
              />
              {isShow ? (
                <DynamicInput
                  options={customFields?.options}
                  onOptionData={handleOptionData}
                />
              ) : (
                ""
              )}
            </div>

            <div className="contact-button-field">
              <button
                className="contact-cancel mintmrm-btn outline"
                onClick={routeChange}
              >
                Cancel
              </button>
              <button type="submit" className="contact-save mintmrm-btn">
                {!isEdit ? "Save" : "Update"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
