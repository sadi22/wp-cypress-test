import { Link } from "react-router-dom";
import ContactListTable from "./Contacts/ContactListTable";
// import { Button } from "rsuite";
import Import from "../components/Icons/Import";
import Plus from "../components/Icons/Plus";
import { useGlobalStore } from "../hooks/useGlobalStore";
import { AdminNavMenuClassChange } from "../utils/admin-settings";

const Contacts = () => {
  // Admin active menu selection
  AdminNavMenuClassChange("mrm-admin", "contacts");

  useGlobalStore.setState({
    navbarMarkup: (
      <>
        <Link to="/contacts/import/csv">
          <button className="import-btn mintmrm-btn outline">
            <Import />
            Import
          </button>
        </Link>

        <Link to="/contacts/create">
          <button className="add-contact-btn mintmrm-btn ">
            <Plus /> Add contact
          </button>
        </Link>
      </>
    ),
    hideGlobalNav: false,
  });

  return <ContactListTable></ContactListTable>;
};

export default Contacts;
