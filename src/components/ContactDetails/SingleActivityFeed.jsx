import { useState } from "react";
import { deleteSingleNote } from "../../services/Note";
import { ClearNotification } from "../../utils/admin-notification";
import DeletePopup from "../DeletePopup";
import CreateNoteIconSm from "../Icons/CreateNoteIconSm";
import EmailDeliveredIcon from "../Icons/EmailDeliveredIcon";
import EmailFailedIcon from "../Icons/EmailFailedIcon";
import NoteDrawer from "../NoteDrawer";
import SuccessfulNotification from "../SuccessfulNotification";

export default function SingleActivityFeed(props) {
  const { refresh, setRefresh } = props;
  const [isDelete, setIsDelete] = useState("none");
  const [deleteTitle, setDeleteTitle] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");
  const [noteId, setNoteId] = useState();
  const [showNotification, setShowNotification] = useState("none");
  const [message, setMessage] = useState("");
  const [isNoteForm, setIsNoteForm] = useState(true);
  const [isCloseNote, setIsCloseNote] = useState(true);

  // Hide delete popup after click on cancel
  const onDeleteShow = async (status) => {
    setIsDelete(status);
  };

  // Delete note after delete confirmation
  const onDeleteStatus = async (status) => {
    if (status) {
      deleteSingleNote(noteId, props.contactId).then((response) => {
        if (200 === response.code) {
          setShowNotification("block");
          setMessage(response?.message);
          setRefresh(!refresh);
        }
        ClearNotification("none", setShowNotification);
      });
    }
    setIsDelete("none");
  };

  // Handle delete popup confirmation
  let handleNoteDelete = (noteId) => {
    setNoteId(noteId);
    setIsDelete("block");
    setDeleteTitle("Delete Note");
    setDeleteMessage("Are you sure you want to delete the note?");
  };

  const openNoteDrawer = (noteId) => {
    setNoteId(noteId);
    setIsNoteForm(true);
    setIsCloseNote(!isCloseNote);
  };

  return (
    <>
      <div className="single-activity-feed">
        {/* <h4 className="activity-date">August 23rd</h4> */}

        <div className="feed-wrapper">
          {/* <div className="single-feed">
                        <span className="icon">
                            <PlusIconMedium />
                        </span>
                        <div className="description"> <b>Added</b> by John via Import from Mailchimp</div>
                        <span className="feed-date">2 hours age</span>
                    </div>

                    <div className="single-feed">
                        <span className="icon icon-danger">
                            <CrossIcon />
                        </span>
                        <div className="description"> <b>Unsubscribed</b> by John via admin action</div>
                        <span className="feed-date">3 hours age</span>
                    </div> */}

          {props.activities?.map((activity) => {
            return (
              <>
                <div className="single-feed" key={activity.id}>
                  {activity.type === "MRM Note" ? (
                    <>
                      <span className="icon icon-warning">
                        <CreateNoteIconSm />
                      </span>
                      <div className="description">
                        <b>{activity.created_by} wrote a note:</b>
                        <div className="writen-note">
                          {activity.description?.length > 200
                            ? activity.description.substring(0, 200) + "..."
                            : activity.description}
                        </div>
                      </div>
                      <span className="feed-date">
                        {activity.created_at} ago
                        <button
                          className="note-edit"
                          title="Edit Note"
                          onClick={(event) => {
                            openNoteDrawer(activity.id);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="note-delete"
                          title="Detele Note"
                          onClick={(event) => {
                            handleNoteDelete(activity.id);
                          }}
                        >
                          Delete
                        </button>
                      </span>
                    </>
                  ) : (
                    <>
                      {activity.status === "sent" ? (
                        <span className="icon icon-success">
                          <EmailDeliveredIcon />
                        </span>
                      ) : (
                        <span className="icon icon-danger">
                          <EmailFailedIcon />
                        </span>
                      )}

                      <div className="description">
                        <b>
                          {activity.status === "sent" ? "Sent" : "Failed"}{" "}
                          {activity.email_subject} to {activity.email_address}
                        </b>
                        <div className="writen-note">{activity.email_body}</div>
                      </div>
                      <span className="feed-date">
                        {activity.created_at} ago
                      </span>
                    </>
                  )}
                </div>
              </>
            );
          })}
        </div>
      </div>
      <div className="mintmrm-container" style={{ display: isDelete }}>
        <DeletePopup
          title={deleteTitle}
          message={deleteMessage}
          onDeleteShow={onDeleteShow}
          onDeleteStatus={onDeleteStatus}
        />
      </div>
      <SuccessfulNotification
        display={showNotification}
        setShowNotification={setShowNotification}
        message={message}
      />
      <NoteDrawer
        isOpenNote={isNoteForm}
        isCloseNote={isCloseNote}
        setIsCloseNote={setIsCloseNote}
        refresh={refresh}
        setRefresh={setRefresh}
        contactId={props.contactId}
        noteId={noteId}
      />
    </>
  );
}
