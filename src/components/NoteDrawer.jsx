import { useEffect, useState } from "react";
import { getSingleNote, submitNote, updateNote } from "../services/Note";
import { ClearNotification } from "../utils/admin-notification";
import CrossIcon from "./Icons/CrossIcon";
import LoadingIndicator from "./LoadingIndicator";
import SuccessfulNotification from "./SuccessfulNotification";

export default function NoteDrawer(props) {
  const { isCloseNote, setIsCloseNote, refresh, setRefresh } = props;
  const [showNotification, setShowNotification] = useState("none");
  const [notificationType, setNotificationType] = useState("success");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [addNoteLoader, setAddNoteLoader] = useState(false);

  const [note, setNote] = useState({
    description: "",
    title: "MRM Note",
    type: "MRM Note",
    created_by: `${window.MRM_Vars.current_userID}`,
  });
  useEffect(() => {
    if (props?.noteId) {
      setShowLoader(true);
      setIsEdit(true);
      getSingleNote(props?.noteId, props?.contactId).then((response) => {
        if (200 === response.code) {
          setNote(response.data);
          setShowLoader(false);
        }
      });
    }
  }, [props?.noteId]);

  const closeSection = () => {
    setIsCloseNote(!isCloseNote);
    setErrors({});
    setShowLoader(false);
  };

  const handleOnChange = async (event) => {
    event.persist();
    const { name, value } = event.target;
    if (value.length > 2000) {
      // Error messages
      setErrors({
        ...errors,
        description: "Description character limit exceeded",
      });
    } else {
      setErrors({
        ...errors,
        description: "",
      });
    }
    setNote((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let result;
    if (isEdit) {
      result = updateNote(note, props.contactId);
    } else {
      result = submitNote(note, props.contactID);
    }

    setAddNoteLoader(true);

    result.then((response) => {
      if (201 === response.code) {
        setNotificationType("success");
        setShowNotification("block");
        setMessage(response?.message);
        setIsCloseNote(!isCloseNote);
        if (!isEdit) {
          setNote({
            description: "",
            title: "MRM Note",
            type: "MRM Note",
          });
        }
        setErrors({});
        setRefresh(!refresh);
        setAddNoteLoader(false);
        setShowLoader(false);

        ClearNotification("none", setShowNotification);
      } else {
        setAddNoteLoader(false);

        // Error messages
        setErrors({
          ...errors,
          description: response.message,
        });
      }
    });
  };
  return (
    <>
      <div
        class={
          props.isOpenNote && !isCloseNote
            ? "mintmrm-step-settings-drawer show-drawer"
            : "mintmrm-step-settings-drawer"
        }
      >
        <span className="drawer-bg-overlay"></span>

        <div className="drawer-wrapper ConditionFields">
          <div className="drawer-header">
            {/* <!-- step title --> */}
            <h4 className="drawer-title">
              <span className="drawer-type">Add Note</span>
            </h4>

            {/* <!-- Add Condition title --> */}

            <span className="mintmrm-drawer-close" onClick={closeSection}>
              <CrossIcon />
            </span>
          </div>
          {/* <!-- /.drawer-header --> */}

          {showLoader ? (
            <LoadingIndicator type="table" />
          ) : (
            <>
              <div className="drawer-body">
                <form onSubmit={handleSubmit}>
                  <div className="body-wrapper">
                    <div className="body-title">
                      <h5>Write a Note</h5>
                      <span>
                        {2000 - note.description.length} characters remaining
                      </span>
                    </div>
                    <div className="text-area">
                      <textarea
                        value={note.description}
                        name="description"
                        onChange={handleOnChange}
                      />
                    </div>
                    <div className="note-footer">
                      <p
                        className={
                          errors?.description
                            ? "error-message show"
                            : "error-message"
                        }
                      >
                        {errors?.description}
                      </p>
                      {/* <Smile />
              <Attachment /> */}
                      {isEdit ? (
                        <button type="submit" className="add-btn mintmrm-btn ">
                          Update Note
                          {addNoteLoader && (
                            <span className="mintmrm-loader"></span>
                          )}
                        </button>
                      ) : (
                        <button type="submit" className="add-btn mintmrm-btn ">
                          Add Note
                          {addNoteLoader && (
                            <span className="mintmrm-loader"></span>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
      <SuccessfulNotification
        display={showNotification}
        setShowNotification={setShowNotification}
        message={message}
        notificationType={notificationType}
        setNotificationType={setNotificationType}
      />
    </>
  );
}
