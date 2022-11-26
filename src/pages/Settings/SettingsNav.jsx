import { Link, useLocation } from "react-router-dom";

import CustomFieldIcon from "../../components/Icons/CustomFieldIcon";
import EmailPendingIcon from "../../components/Icons/EmailPendingIcon";
import EmailSettingsIcon from "../../components/Icons/EmailSettingsIcon";
import GeneralSettingIcon from "../../components/Icons/GeneralSettingIcon";
import SettingIcon from "../../components/Icons/SettingIcon";
import SmtpIcon from "../../components/Icons/SmtpIcon";
import WooCommerceIcon from "../../components/Icons/WooCommerceIcon";
import { AdminNavMenuClassChange } from "../../utils/admin-settings";

export default function SettingsNav() {
  // Admin active menu selection
  AdminNavMenuClassChange("mrm-admin", "settings");
  const location = useLocation();

  return (
    <div className="settings-navbar">
      <ul>
        <li>
          <Link
            className={`mintmrm-btn outline ${
              location.pathname.includes("business") ? "active" : ""
            }`}
            to="/settings/business-info"
          >
            <SettingIcon />
            Business Settings
          </Link>
        </li>

        <li>
          <Link
            className={`mintmrm-btn outline ${
              location.pathname.includes("email") ? "active" : ""
            }`}
            to="/settings/email-settings"
          >
            <EmailSettingsIcon />
            Email Settings
          </Link>
        </li>
        <li>
          <Link
            className={`mintmrm-btn outline ${
              location.pathname.includes("optin") ? "active" : ""
            }`}
            to="/settings/optin"
          >
            <EmailPendingIcon />
            Double Opt-in Settings
          </Link>
        </li>
        <li>
          <Link
            className={`mintmrm-btn outline ${
              location.pathname.includes("general") ? "active" : ""
            }`}
            to="/settings/general"
          >
            <GeneralSettingIcon />
            General Settings
          </Link>
        </li>
        {window.MRM_Vars.is_wc_active && (
          <li>
            <Link
              className={`mintmrm-btn outline ${
                location.pathname.includes("woocommerce") ? "active" : ""
              }`}
              to="/settings/woocommerce"
            >
              <WooCommerceIcon />
              WooCommerce settings
            </Link>
          </li>
        )}
        <li>
          <Link
            className={`mintmrm-btn outline ${
              location.pathname.includes("custom-field") ? "active" : ""
            }`}
            to="/settings/custom-field"
          >
            <CustomFieldIcon />
            Contact Custom Fields
          </Link>
        </li>
        <li>
          <Link
            className={`mintmrm-btn outline ${
              location.pathname.includes("smtp") ? "active" : ""
            }`}
            to="/settings/smtp"
          >
            <SmtpIcon />
            SMTP
          </Link>
        </li>
      </ul>
    </div>
  );
}
