import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGlobalStore } from "../../hooks/useGlobalStore";
import { deleteSingleContact } from "../../services/Contact";
import DeletePopup from "../../components/DeletePopup";
import EmailDrawer from "../../components/EmailDrawer";
import HoverMenu from "../../components/HoverMenu";
import AddNoteIcon from "../../components/Icons/AddNoteIcon";
import Delete from "../../components/Icons/Delete";
import EyeIcon from "../../components/Icons/EyeIcon";
import SendMessageIcon from "../../components/Icons/SendMessageIcon";
import ThreeDotIcon from "../../components/Icons/ThreeDotIcon";
import NoteDrawer from "../../components/NoteDrawer";
import Portal from "../../components/Portal";
import ListenForOutsideClicks from "../../components/ListenForOutsideClicks";

export default function SingleContact(props) {
  // global counter update real time
  const counterRefresh = useGlobalStore((state) => state.counterRefresh);
  const navigate = useNavigate();
  const [isActive, setActive] = useState(false);
  const menuButtonRef = useRef(null);
  const [isDelete, setIsDelete] = useState("none");
  const [deleteTitle, setDeleteTitle] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");
  const [isNoteForm, setIsNoteForm] = useState(true);
  const [isCloseNote, setIsCloseNote] = useState(true);
  const [isEmailForm, setIsEmailForm] = useState(true);
  const [isClose, setIsClose] = useState(true);

  const {
    contact,
    toggleRefresh,
    currentActive,
    setCurrentActive,
    handleSelectOne,
    selected,
  } = props;
  const [listening, setListening] = useState(false);

  const moreOptionRef = useRef(null);

  useEffect(
    ListenForOutsideClicks(listening, setListening, moreOptionRef, setActive)
  );

  // Hide delete popup after click on cancel
  const onDeleteShow = async (status) => {
    setIsDelete(status);
  };

  const handleUpdate = () => {
    navigate(`/contacts/update/${contact.id}`);
  };

  const noteForm = () => {
    setIsNoteForm(true);
    setIsCloseNote(!isCloseNote);
  };
  const emailForm = () => {
    setIsEmailForm(true);
    setIsClose(!isClose);
  };

  return (
    <>
      <tr>
        <td className="email-wrapper">
          <div className="email">
            <span class="mintmrm-checkbox no-title">
              <input
                type="checkbox"
                name={contact.id}
                id={contact.id}
                onChange={handleSelectOne}
                checked={selected.includes(contact.id)}
              />
              <label for={contact.id}></label>
            </span>

            <Link to={`../contacts/update/${contact.id}`}>{contact.email}</Link>
          </div>
        </td>

        <td className="first-name">
          {contact.first_name ? contact.first_name : "-"}
        </td>

        <td className="last-name">
          {contact.last_name ? contact.last_name : "-"}
        </td>

        <td className="list">
          {contact?.lists?.length
            ? contact.lists.map((list) => {
                return (
                  <span className="list-item" key={list.id}>
                    {list.title}
                  </span>
                );
              })
            : "-"}
        </td>

        <td className="tag">
          {contact?.tags?.length
            ? contact.tags.map((tag) => {
                return (
                  <span className="tag-item" key={tag.id}>
                    {tag.title}
                  </span>
                );
              })
            : "-"}
        </td>

        <td className="status">
          <span className={contact.status}>
            {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
          </span>
        </td>

        {props.columns.map((column) => {
          if ("last_activity" == column.id) {
            return (
              <td className="last-activity" key={column.id}>
                {contact.last_activity ? contact.last_activity : "-"}
              </td>
            );
          }

          if ("source" == column.id) {
            return (
              <td className="source" key={column.id}>
                <td className="source">
                  {contact.source ? contact.source : "-"}
                </td>
              </td>
            );
          }

          if (column.id in Object.assign({}, contact?.meta_fields)) {
            return (
              <td className={column.id} key={column.id}>
                {contact?.meta_fields?.[column.id]
                  ? contact?.meta_fields?.[column.id]
                  : "-"}
              </td>
            );
          } else {
            return (
              <td className={column.id} key={column.id}>
                -
              </td>
            );
          }
        })}

        <td className="action" ref={moreOptionRef}>
          <button
            className="more-option"
            onClick={() => {
              setActive((prev) => !prev);
              setCurrentActive(contact.id);
            }}
            ref={menuButtonRef}
          >
            <ThreeDotIcon />

            {currentActive == contact.id && ( // only show the menu if both active and current active points to this listitem
              <Portal>
                <HoverMenu elementRef={menuButtonRef} x={-10} y={-20}>
                  <ul
                    style={{ width: "190px" }}
                    className={
                      currentActive == contact.id && isActive
                        ? "mintmrm-dropdown show"
                        : "mintmrm-dropdown"
                    }
                  >
                    <li className="action-list" onClick={handleUpdate}>
                      <EyeIcon />
                      View
                    </li>
                    <li className="action-list" onClick={emailForm}>
                      <SendMessageIcon />
                      Send message
                    </li>
                    <li className="action-list" onClick={noteForm}>
                      <AddNoteIcon />
                      Add note
                    </li>
                    <li
                      className="action-list"
                      onClick={() => {
                        props.deleteContact(contact.id);
                      }}
                    >
                      <Delete />
                      Delete
                    </li>
                  </ul>
                </HoverMenu>
              </Portal>
            )}
          </button>
          <NoteDrawer
            isOpenNote={isNoteForm}
            isCloseNote={isCloseNote}
            setIsCloseNote={setIsCloseNote}
            // contactID={id}
            // refresh={refresh}
            // setRefresh={setRefresh}
          />
          <EmailDrawer
            isOpen={isEmailForm}
            isClose={isClose}
            setIsClose={setIsClose}
            contact={contact}
            // refresh={refresh}
            // setRefresh={setRefresh}
          />
        </td>
      </tr>
      <div className="mintmrm-container" style={{ display: isDelete }}>
        <DeletePopup
          title={deleteTitle}
          message={deleteMessage}
          onDeleteShow={onDeleteShow}
        />
      </div>
    </>
  );
}
