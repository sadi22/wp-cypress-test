import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";

import EmailBuilder from "./EmailBuilder";

import ArrowLeftIcon from "../../components/Icons/ArrowLeftIcon";
import ArrowRightIcon from "../../components/Icons/ArrowRightIcon";
import CrossIcon from "../../components/Icons/CrossIcon";

export default function CampaignTemplates(props) {
  const {
    isClose,
    setIsClose,
    setEmailBody,
    emailData,
    selectedEmailIndex,
    isNewCampaign,
    campaignData,
    setIsTemplate,
    refresh,
    setRefresh,
  } = props;
  const [isCloseBuilder, setIsCloseBuilder] = useState("none");
  const [isTemplateBuilder, setIsTemplateBuilder] = useState(true);
  const [isEmailBuilderOpen, setIsEmailBuilderOpen] = useState(false);
  const [dataTest, setData] = useState({});

  const closeSection = () => {
    setIsClose(!isClose);
  };

  // Open template builder with full height and width
  const openTemplateBuilder = (event, data) => {
    setIsEmailBuilderOpen(true);
    setIsTemplateBuilder(true);
    setIsCloseBuilder(!isCloseBuilder);
  };

  // Templates selection popup close after finishing email building
  const setCloseTemplateSelection = (status) => {
    if ("hide" == status) {
      setIsClose(!isClose);
    }
  };
  const emailEditorRef = useRef(null);

  const closeEmailBuilder = () => {
    setIsCloseBuilder("none");
  };

  const exportHtml = () => {
    emailEditorRef.current.editor.exportHtml((data) => {
      const { design, html } = data;
    });
  };

  return (
    <>
      <div
        className={
          props.isOpen && !isClose
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
              <h4 className="modal-title">Choose Template</h4>

              <ul className="template-filter">
                <li className="active">Pop-up</li>
                <li>Slide-in</li>
                <li>Fixed bar</li>
                <li>Below pages</li>
              </ul>

              <div className="template-type">
                <select name="" id="">
                  <option value="">Form Type</option>
                  <option value="">Popup</option>
                  <option value="">Embeded</option>
                  <option value="">Landing Page</option>
                </select>
              </div>
            </div>

            <div className="template-modal-body">
              <div className="mintmrm-template-wrapper">
                <div className="mintmrm-single-template create-from-scratch">
                  <div className="mintmrm-single-remote-wrapper">
                    <div className="mintmrm-single-remote-template">
                      {emailData?.email_body?.length === 0 ? (
                        <Link to="">
                          <button
                            type="button"
                            className="mintmrm-btn"
                            onClick={openTemplateBuilder}
                          >
                            Start From Scratch
                          </button>
                        </Link>
                      ) : (
                        <Link to="">
                          <button
                            type="button"
                            className="mintmrm-btn"
                            onClick={openTemplateBuilder}
                          >
                            Edit Template
                          </button>
                        </Link>
                      )}
                      <div className="template-image-wrapper"></div>
                    </div>

                    <div className="template-info">
                      <span className="title">title</span>
                    </div>
                  </div>
                </div>

                {/* <CampaignSingleTemplate />
                <CampaignSingleTemplate />
                <CampaignSingleTemplate />
                <CampaignSingleTemplate /> */}

                <div className="mintmrm-single-template create-from-scratch coming-soon">
                  <div className="coming-soon-inner">
                    <h2>Amazing Templates Are Coming Soon</h2>
                  </div>
                </div>
              </div>
            </div>

            <div className="template-modal-footer">
              <div className="template-pagination">
                <button type="button" className="prev">
                  <ArrowLeftIcon />
                </button>

                <button type="button" className="next">
                  <ArrowRightIcon />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EmailBuilder
        refresh={refresh}
        setRefresh={setRefresh}
        isOpen={isTemplateBuilder}
        isCloseBuilder={isCloseBuilder}
        isEmailBuilderOpen={isEmailBuilderOpen}
        isNewCampaign={isNewCampaign}
        emailData={emailData}
        campaignData={campaignData}
        selectedEmailIndex={selectedEmailIndex}
        setEmailBody={setEmailBody}
        setIsEmailBuilderOpen={setIsEmailBuilderOpen}
        setIsTemplate={setIsTemplate}
        setIsCloseBuilder={closeEmailBuilder}
        setCloseTemplateSelection={setCloseTemplateSelection}
        setIsReadonly={props.setIsReadonly}
        isReadonly={props.isReadonly}
      />
    </>
  );
}
