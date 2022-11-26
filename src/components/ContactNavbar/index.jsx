import { __ } from "@wordpress/i18n";
import { Link, useLocation } from "react-router-dom";
import { useGlobalStore } from "../../hooks/useGlobalStore";
import routes from "../../routes";

import "./style.css";

export default function Navbar(props) {
  const { countGroups } = props;
  const location = useLocation();
  const navbarMarkup = useGlobalStore((state) => state.navbarMarkup);
  return (
    <>
      <div className="contact-header">
        <div className="mintmrm-container">
          <div className="header-wrapper">
            <div className="left-header-section">
              <div className="site-logo">
                <Link to="/">
                  <h1>Contacts</h1>
                </Link>
              </div>
              <nav className="mintmrm-navbar">
                <ul className="navbar-ul">
                  {routes.map((route, index) => {
                    if (!route.hideInMenu) {
                      return (
                        <li
                          className={
                            location.pathname == route.path
                              ? "navbar-li active"
                              : "navbar-li "
                          }
                          key={index}
                        >
                          <Link to={route.path}>
                            {__(route.title, "mintmrm")}

                            {route.bage && (
                              <span className="bage">{route.bage}</span>
                            )}

                            {"Contacts" === route.title ? (
                              <span className="bage">
                                {countGroups.contacts
                                  ? countGroups.contacts
                                  : "0"}
                              </span>
                            ) : "Lists" === route.title ? (
                              <span className="bage">
                                {countGroups.lists ? countGroups.lists : "0"}
                              </span>
                            ) : "Tags" === route.title ? (
                              <span className="bage">
                                {countGroups.tags ? countGroups.tags : "0"}
                              </span>
                            ) : "Segments" === route.title ? (
                              <span className="bage">
                                {countGroups.segments ? countGroups.segments : "0"}
                              </span>
                            ) : (
                              ""
                            )}
                          </Link>
                        </li>
                      );
                    }
                  })}
                </ul>
              </nav>
            </div>
            <div className="right-header-section">
              <div className="navbar-buttons">{navbarMarkup}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
