import "../../style/Canvas.css";
import ConditionSettingsDrawer from "./ConditionSettingsDrawer";
import DelaySettingsDrawer from "./DelaySettingsDrawer";
import SendEmailSettingsDrawer from "./SendEmailSettingsDrawer";
import TriggerSettingsDrawer from "./TriggerSettingsDrawer";

const CanvasSettingsDrawer = (props) => {
  const {
    openSettingsDrawer,
    setOpenSettingsDrawer,
    selectedNodeID,
    selectedNodeType,
  } = props;

  return (
    <>
      <div
        className={`canvas-settings-wrapper ${
          openSettingsDrawer
            ? "canvas-settings-wrapper-open"
            : "canvas-settings-wrapper-close"
        }`}
      >
        <button onClick={() => setOpenSettingsDrawer(false)}>Close</button>
        <div className="canvas-step-title">{selectedNodeID}</div>
        <div className="canvas-step-title">{selectedNodeType}</div>
        {
          selectedNodeType === "triggerStep" && (
            <TriggerSettingsDrawer />
          )
        }
        {
          selectedNodeType === "delayStep" && (
            <DelaySettingsDrawer />
          )
        }
        {
          selectedNodeType === "sendEmailStep" && (
            <SendEmailSettingsDrawer />
          )
        }
        {
          selectedNodeType === "conditionStep" && (
            <ConditionSettingsDrawer />
          )
        }
      </div>
    </>
  );
};

export default CanvasSettingsDrawer;
