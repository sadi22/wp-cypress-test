import Confirmation from "../../components/Icons/Confirmation";
import { Link } from "react-router-dom";
import TooltipQuestionIcon from "../../components/Icons/TooltipQuestionIcon";
import EditButton from "../../components/Icons/EditButton";
import Facebook from "../../components/Icons/Facebook";
import Twitter from "../../components/Icons/Twitter";
import Instagram from "../../components/Icons/Instagram";
import Linkedin from "../../components/Icons/Linkedin";

export default function CampaignConfirmation() {
  return (
    <div className="mintmrm--campaign-confirmation">
      <div className="mintmrm-container">
        <div className="campaign-confirmation-wrapper">
          <div className="congratulation-section">
            <div className="confirmation-detail">
              <Confirmation />
              <h3>Congratulations</h3>
              <span className="successful-title">
                Your data have been successfully imported.
              </span>
              <Link to="">
                <button className="view-campaign mintmrm-btn ">
                  View Campaign
                </button>
              </Link>
            </div>
          </div>

          <div className="confirmation-footer-section">
            <div className="share-campaign">
              <h5 className="title">Share Your Campaign</h5>
              <div className="campaign-link">
                <div className="link-title">
                  <p className="text">Campaign Link</p>
                  <span className="mintmrm-tooltip">
                    <TooltipQuestionIcon />
                    <p>
                      Want to brand your campaign link? Click edit to create a
                      custom URL.
                    </p>
                  </span>
                </div>
                <div className="edit-link">
                  <input
                    type="text"
                    placeholder="https://mint.com/[xxxx]/[xxxx]"
                  />
                  <div className="svg-icon">
                    <EditButton />
                  </div>
                </div>
              </div>
            </div>

            <div className="social-media">
              <h5 className="title">Add A Social Post To Your Campaign</h5>
              <div className="campaign-link">
                <Facebook />
                <Twitter />
                <Instagram />
                <Linkedin />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
