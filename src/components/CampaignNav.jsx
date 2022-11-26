import { Link, useLocation } from "react-router-dom";
import { useGlobalStore } from "../hooks/useGlobalStore";
import Plus from "./Icons/Plus";

export default function CampaignsNavbar() {
  const location = useLocation();
  useGlobalStore.setState({
    hideGlobalNav: true,
  });

  return (
    <>
      <div className="campaign-header">
        <div className="mintmrm-container">
          <div className="header-wrapper">
            <div className="left-header-section">
              <div className="site-logo">
                <Link to="/campaigns">
                  <h1>Campaigns</h1>
                </Link>
              </div>
            </div>
            <div className="right-header-section">
              <div className="navbar-buttons">
                <Link to="/campaigns/create">
                  <button className="add-contact-btn mintmrm-btn ">
                    <Plus /> Add Campaign
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
