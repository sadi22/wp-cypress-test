import { useState } from "react";
import CrossIcon from "./Icons/CrossIcon";
import Delete from "./Icons/Delete";

export default function DeletePopup(props) {
  const [deleteClass, setDeleteClass] = useState(false);

  const onCancel = () => {
    setDeleteClass(true);
    props.onDeleteShow("none");
  };

  const onDelete = () => {
    props.onDeleteStatus(true);
  };

  const onMultilpleDelete = () => {
    props.onMultiDelete(true);
  };
  

  return (
    <div className= {deleteClass ? "mintmrm-delete-alert-wrapper" : "mintmrm-delete-alert-wrapper"} >
      <div className="mintmrm-delete-confirmation">
        <div className="delete-confirmation-header">
          <h3>{props.title}</h3>
          <div className="cross-icon" onClick={onCancel}>
            <CrossIcon />
          </div>
        </div>
        <div className="delete-confirmation-body">
          <Delete />
          <p>{props.message}</p>
        </div>

        <ul className="mintmrm-delete-confirm-btn">
          <li>
            <button className="btn-default cancel" onClick={onCancel}>
              Cancel
            </button>
          </li>
          <li>
            <button
              type="button"
              className="btn-default delete product-trash"
              onClick={props.selected?.length > 0 ? onMultilpleDelete : onDelete}
            >
              Delete
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
