import { useState } from "react";
import { submitEmail } from "../services/Message";
import { ClearNotification } from "../utils/admin-notification";
import CrossIcon from "./Icons/CrossIcon";
import SuccessfulNotification from "./SuccessfulNotification";

export default function EmailDrawer(props) {
  const { isClose, setIsClose, contact, refresh, setRefresh } = props;
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [showNotification, setShowNotification] = useState("none");
  const [notificationType, setNotificationType] = useState("success");
  const [sendEmailLoader, setSendEmailLoader] = useState(false);

  const [email, setEmail] = useState({
    email_subject: "",
    email_body: "",
    sender_id: `${window.MRM_Vars.current_userID}`,
  });

  const closeSection = () => {
    setIsClose(!isClose);
    setErrors({});
  };

  const handleOnChange = async (event) => {
    event.persist();
    const { name, value } = event.target;

    setEmail((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    email.email_address = contact.email;

    setSendEmailLoader(true);

    submitEmail(email, contact.id).then((response) => {
      if (201 === response.code) {
        setNotificationType("success");
        setShowNotification("block");
        setMessage(response.message);
        setIsClose(!isClose);
        setErrors({});
        setEmail({
          email_subject: "",
          email_body: "",
        });
        setRefresh(!refresh);
        setSendEmailLoader(false);

        ClearNotification("none", setShowNotification);
      } else {
        // Error messages
        setSendEmailLoader(false);

        setErrors({
          ...errors,
          email: response.message,
        });
      }
    });
  };
  return (
    <>
      <div
        class={
          props.isOpen && !isClose
            ? "mintmrm-step-settings-drawer show-drawer"
            : "mintmrm-step-settings-drawer"
        }
      >
        <span className="drawer-bg-overlay"></span>

        <div className="drawer-wrapper">
          <div className="drawer-header">
            {/* <!-- step title --> */}
            <h4 className="drawer-title">
              <span className="drawer-type">New Message</span>
            </h4>

            <span className="mintmrm-drawer-close" onClick={closeSection}>
              <CrossIcon />
            </span>
          </div>
          {/* <!-- /.drawer-header --> */}

          <div className="drawer-body">
            <div className="body-wrapper">
              <div className="email-to">
                <span className="">To:</span>
                <input
                  type="text"
                  disabled
                  name="email_address"
                  value={contact.email}
                  onChange={handleOnChange}
                />
              </div>
              <div className="email-subject">
                <span className="">Subject:</span>
                <input
                  type="text"
                  value={email.email_subject}
                  name="email_subject"
                  onChange={handleOnChange}
                />
              </div>
              <div className="email-body">
                <textarea
                  value={email.email_body}
                  name="email_body"
                  onChange={handleOnChange}
                />
              </div>
              <div className="body-footer">
                <p
                  className={
                    errors?.email ? "error-message show" : "error-message"
                  }
                >
                  {errors?.email}
                </p>
                <button
                  className="contact-cancel mintmrm-btn outline"
                  onClick={closeSection}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="contact-save mintmrm-btn "
                >
                  Send
                  {sendEmailLoader && <span className="mintmrm-loader"></span>}
                </button>
              </div>
            </div>
          </div>
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
