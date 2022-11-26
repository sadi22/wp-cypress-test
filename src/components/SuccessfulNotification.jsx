import { useState } from "react";
import CrossIcon from "./Icons/CrossIcon";
import SuccessfulIcon from "./Icons/SuccessfulIcon";
import WarningIcon from "./Icons/WarningIcon";

export default function SuccessfulNotification(props) {
  const [cancelBtn, setCancelBtn] = useState(false);
  const { notificationType, setNotificationType } = props;
  const onCancel = () => {
    props.setShowNotification("none");
    setCancelBtn(true);
  };
  return (
    <>
      <div
        style={{ display: props.display }}
        className={
          "success" == notificationType
            ? "successful-notification"
            : "warn-notification"
        }
      >
        <div className="alert-toast">
          <div className="alert-container">
            <div className="successfull-icon">
              {"success" == notificationType ? (
                <SuccessfulIcon />
              ) : (
                <WarningIcon />
              )}
            </div>
            <p>{props.message}</p>
            <div className="cross-icon" onClick={onCancel}>
              <CrossIcon />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
