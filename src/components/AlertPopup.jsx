import { useState } from "react";
import CrossIcon from "./Icons/CrossIcon";
import Delete from "./Icons/Delete";

export default function AlertPopup(props) {
  const [deleteClass, setDeleteClass] = useState(false);

  const onCancel = () => {
    setDeleteClass(true);
    props.onShowAlert("none");
  };

  return (
    <div
    className={
        deleteClass
          ? "mintmrm-delete-alert-wrapper"
          : "mintmrm-delete-alert-wrapper"
      }
    >
      <div className="mintmrm-delete-confirmation">
        <div className="delete-confirmation-header">
          <h3>No item selected</h3>
          <div className="cross-icon" onClick={onCancel}>
            <CrossIcon />
          </div>
        </div>
        <div className="delete-confirmation-body">
          <Delete />
          <p>Please select at least one item to bulk action.</p>
        </div>

        <ul className="mintmrm-delete-confirm-btn">
          <li>
            <button className="btn-default cancel" onClick={onCancel}>
              Ok
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
