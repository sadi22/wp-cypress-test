import React, { useEffect, useRef, useState } from "react";
import CrossIcon from "../../components/Icons/CrossIcon";
import {
  createNewForm,
  getAllTemplates,
  getSingleTemplate,
} from "../../services/Form";

import { useNavigate } from "react-router-dom";
import FormSingleTemplate from "../TemplateGallery/FormSingleTemplate";

const FormTemplate = (props) => {
  let navigate = useNavigate();

  const [saveLoader, setSaveLoader] = useState(false);
  const { isClose, setIsClose, setIsTemplate, isOpen } = props;
  const [isCloseBuilder, setIsCloseBuilder] = useState("none");
  const [isTemplateBuilder, setIsTemplateBuilder] = useState(true);
  const [isFormBuilderOpen, setIsFormBuilderOpen] = useState(false);
  const [formTemplates, setFormTemplates] = useState([]);
  const [formTemplatesFilter, setFormTemplatesFilter] = useState([]);
  const [countFormTemplates, setCountFormTemplates] = useState(0);
  const [formBuilderUrl, setFormBuilderUrl] = useState(
    `${window.MRM_Vars.admin_url}admin.php?page=mrm-admin#/form-builder/`
  );

  const [formPositionActive, setFormPositionActive] = useState("popup");

  const closeSection = () => {
    setIsClose(!isClose);
  };

  const onImportTemplate = async (template_id) => {
    setSaveLoader(true);
    getSingleTemplate(template_id).then((response) => {
      let template = response?.data;
      const formData = {
        title: template.title,
        form_body: template.content,
        group_ids: {
          lists: [],
          tags: [],
        },
        status: "draft",
        meta_fields: {
          settings: template.settings,
        },
      };

      createNewForm(formData).then((response) => {
        if (201 === response.code) {
          // Navigate user with success message
          navigate(`/form-builder/${response.data}`, {
            state: { status: "form-created", message: response?.message },
          });
        } else {
        }
      });
    });
  };

  // Open template builder with full height and width
  const openTemplateBuilder = (event, data) => {
    setIsFormBuilderOpen(true);
    setIsTemplateBuilder(true);
    setIsCloseBuilder(!isCloseBuilder);
  };

  // Get all form templates ffrom the helper addon
  useEffect(() => {
    getAllTemplates(1, 10).then((response) => {
      setFormTemplates(response.forms);
      const updateItems = response.forms.filter((curElem) => {
        return curElem.form_position === "popup";
      });
      setFormTemplatesFilter(updateItems);
      setCountFormTemplates(response.count);
    });
  }, []);

  // Templates selection popup close after finishing email building
  const setCloseTemplateSelection = (status) => {
    if ("hide" == status) {
      setIsClose(!isClose);
    }
  };
  const emailEditorRef = useRef(null);

  const openFormBuilder = () => {
    window.location.replace(formBuilderUrl);
    window.location.reload();
  };
  const SelectFilter = (filter) => {
    setFormPositionActive(filter);
    const updateItems = formTemplates.filter((curElem) => {
      return curElem.form_position === filter;
    });
    setFormTemplatesFilter(updateItems);
  };
  const FormPosition = [
    { label: "Pop Up", value: "popup" },
    { label: "Fly Ins", value: "flyins" },
    { label: "Fixed on top", value: "fixed-on-top" },
    { label: "Fixed on bottom", value: "fixed-on-bottom" },
    { label: "Fixed on right", value: "fixed-on-right" },
  ];

  return (
    <>
      <div
        className={
          isOpen && !isClose
            ? "mintmrm-template-modal active"
            : "mintmrm-template-modal"
        }
      >
        <div className="template-modal-inner">
          <div className="cross-icon" onClick={closeSection}>
            <CrossIcon />
          </div>

          <div className="template-modal-overflow">
            <div className="template-modal-header">
              <h4 className="modal-title">Choose Form</h4>

              <ul className="template-filter">
                {FormPosition.map((position) => {
                  return (
                    <li
                      key={position.value}
                      className={
                        formPositionActive == position.value ? "active" : ""
                      }
                      onClick={() => SelectFilter(position.value)}
                    >
                      {position.label}
                    </li>
                  );
                })}
              </ul>

              {/*<div className="template-type">*/}
              {/*  <select name="" id="">*/}
              {/*    <option value="">Form Type</option>*/}
              {/*    <option value="">Popup</option>*/}
              {/*    <option value="">Embeded</option>*/}
              {/*    <option value="">Landing Page</option>*/}
              {/*  </select>*/}
              {/*</div>*/}
            </div>

            <div className="template-modal-body">
              <div className="mintmrm-template-wrapper">
                <div className="mintmrm-single-template create-from-scratch">
                  <div className="mintmrm-single-remote-wrapper">
                    <div className="mintmrm-single-remote-template">
                      <button
                        type="button"
                        className="mintmrm-btn"
                        onClick={openFormBuilder}
                      >
                        {" "}
                        Start From Scratch{" "}
                      </button>
                      <div className="template-image-wrapper"></div>
                    </div>

                    <div className="template-info">
                      <span className="title">title</span>
                    </div>
                  </div>
                </div>

                {formTemplatesFilter?.length > 0 ? (
                  formTemplatesFilter.map((template) => {
                    return (
                      <FormSingleTemplate
                        key={template.id}
                        template={template}
                        onImportTemplate={onImportTemplate}
                        setSaveLoader={setSaveLoader}
                        saveLoader={saveLoader}
                      />
                    );
                  })
                ) : (
                  <div className="mintmrm-single-template create-from-scratch coming-soon">
                    <div className="coming-soon-inner">
                      <h2>Amazing Templates Are Coming Soon</h2>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* <div className="template-modal-footer">
              <div className="template-pagination">
                <button type="button" className="prev">
                  <ArrowLeftIcon />
                </button>

                <button type="button" className="next">
                  <ArrowRightIcon />
                </button>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default FormTemplate;
