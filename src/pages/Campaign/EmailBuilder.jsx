import React, { Suspense } from "react";
const Editor = React.lazy(() => import("../../components/Editor/Editor"));

const EmailBuilder = (props) => {
  const {
    isCloseBuilder,
    selectedEmailIndex,
    emailData,
    isNewCampaign,
    campaignData,
    setIsTemplate,
    setIsCloseBuilder,
    refresh,
    setRefresh,
  } = props;
  return (
    <>
      <div
        style={{ display: isCloseBuilder }}
        className={
          props.isOpen && !isCloseBuilder
            ? "mintmrm-template-alert-wrapper email-builder-editor"
            : "mintmrm-template-alert-wrapper"
        }
      >
        <div className="email-builder-section" style={{ height: "100%" }}>
          <Suspense fallback={<div className="email-builder-loading"><span className="mintmrm-loader"></span></div>}>
            {!isCloseBuilder && (
              <Editor
                selectedEmailIndex={selectedEmailIndex}
                emailData={emailData}
                campaignData={campaignData}
                isNewCampaign={isNewCampaign}
                setIsTemplate={setIsTemplate}
                setIsCloseBuilder={setIsCloseBuilder}
                refresh={refresh}
                setRefresh={setRefresh}
                setIsReadonly={props.setIsReadonly}
                isReadonly={props.isReadonly}
              />
            )}
          </Suspense>
        </div>
      </div>
    </>
  );
};

export default EmailBuilder;
