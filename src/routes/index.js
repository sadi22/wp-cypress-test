import { __ } from "@wordpress/i18n";
import ContactDetails from "../components/ContactDetails";
import CreateContact from "../components/CreateContact";
import CustomFieldCreate from "../components/CustomFieldCreate";
import CustomFields from "../components/CustomFields";
import Dashboard from "../components/Dashboard";
import ImportConfirmation from "../components/ImportConfirmation";
import SelectFieldsMap from "../components/SelectFieldsMap";
import WordPressFieldMap from "../components/WordPressFieldMap";
import AllCampaigns from "../pages/Campaign";
import AddCampaign from "../pages/Campaign/AddCampaign";
import EditCampaign from "../pages/Campaign/EditCampaign";
import EmailBuilder from "../pages/Campaign/EmailBuilder";
import Contacts from "../pages/Contacts";
import FormIndex from "../pages/Form";
import FormEditor from "../pages/Form/FormEditor";
import ImportContactFile from "../pages/ImportContactFile";
import ImportContactRaw from "../pages/ImportContactRaw";
import ImportMailchimp from "../pages/ImportMailchimp";
import ImportWordpress from "../pages/ImportWordpress";
import Lists from "../pages/Tag/index";
import Tags from "../pages/List/index";
import Segments from "../pages/Segment/index";
import CreateSegment from "../pages/Segment/CreateSegment";
import BusinessSettings from "../pages/Settings/BusinessSettings";
import EmailSettings from "../pages/Settings/EmailSettings";
import DoubleOptin from "../pages/Settings/DoubleOptin";
import GeneralSettings from "../pages/Settings/GeneralSettings";
import WooCommerceSettings from "../pages/Settings/WooCommerceSettings";
import SmtpSettings from "../pages/Settings/SmtpSettings";
import CustomFieldSettings from "../pages/Settings/CustomFieldSettings";

const routes = [
  {
    path: "/",
    element: Dashboard,
    title: __("Dashboard", "mrm"),
    hideInMenu: true,
  },
  {
    path: "/contacts",
    element: Contacts,
    title: __("Contacts", "mrm"),
    // bage: 20,
  },
  {
    path: "/contacts/create",
    element: CreateContact,
    hideInMenu: true,
  },
  {
    path: "/contacts/update/:id",
    element: ContactDetails,
    hideInMenu: true,
  },
  {
    path: "/contacts/import/csv",
    element: ImportContactFile,
    hideInMenu: true,
  },
  {
    path: "/contacts/import/raw",
    element: ImportContactRaw,
    hideInMenu: true,
  },
  {
    path: "/contacts/import/mailchimp",
    element: ImportMailchimp,
    hideInMenu: true,
  },
  {
    path: "/contacts/import/wordpress",
    element: ImportWordpress,
    hideInMenu: true,
  },
  {
    path: "/contacts/import/wordpress/map",
    element: WordPressFieldMap,
    hideInMenu: true,
  },
  {
    path: "/contacts/import/csv/map",
    element: SelectFieldsMap,
    hideInMenu: true,
  },
  {
    path: "/contacts/import/raw/map",
    element: SelectFieldsMap,
    hideInMenu: true,
  },
  {
    path: "/contacts/import/mailchimp/map",
    element: SelectFieldsMap,
    hideInMenu: true,
  },
  {
    path: "/contacts/import/confirmation",
    element: ImportConfirmation,
    hideInMenu: true,
  },
  {
    path: "/lists",
    element: Lists,
    title: __("Lists", "mrm"),
    //bage: 15,
  },
  {
    path: "/tags",
    element: Tags,
    title: __("Tags", "mrm"),
    // bage: 18,
  },
  {
    path: "/segments",
    element: Segments,
    title: __("Segments", "mrm"),
    // bage: 18,
  },
  {
    path: "/segments/create",
    element: CreateSegment,
    hideInMenu: true,
  },
  {
    path: "/custom-fields",
    element: CustomFields,
    title: __("Custom Fields", "mrm"),
    // bage: 18,
    hideInMenu: true,
  },
  {
    path: "/custom-fields/create",
    element: CustomFieldCreate,
    hideInMenu: true,
  },
  {
    path: "/custom-fields/update/:id",
    element: CustomFieldCreate,
    hideInMenu: true,
  },
  {
    path: "/campaigns/",
    element: AllCampaigns,
    hideInMenu: true,
  },
  // {
  //   path: "/campaigns/sequences",
  //   element: AllCampaigns,
  //   title: __("Email Sequences", "mrm"),
  //   campaignMenu: true,
  //   hideInMenu: true,
  // },
  // {
  //   path: "/campaigns/templates",
  //   element: AllCampaigns,
  //   title: __("Email Templates", "mrm"),
  //   campaignMenu: true,
  //   hideInMenu: true,
  // },
  {
    path: "/campaigns/create",
    element: AddCampaign,
    hideInMenu: true,
  },
  {
    path: "/campaigns/builder",
    element: EmailBuilder,
    hideInMenu: true,
  },
  {
    path: "/campaign/edit/:id",
    element: EditCampaign,
    hideInMenu: true,
  },
  {
    path: "/forms/",
    element: FormIndex,
    hideInMenu: true,
  },
  {
    path: "/form-builder/:id",
    element: FormEditor,
    hideInMenu: true,
  },
  {
    path: "/form-builder/",
    element: FormEditor,
    hideInMenu: true,
  },
  {
    path: "/settings/business-info",
    element: BusinessSettings,
    hideInMenu: true,
  },
  {
    path: "/settings/email-settings",
    element: EmailSettings,
    hideInMenu: true,
  },
  {
    path: "/settings/optin",
    element: DoubleOptin,
    hideInMenu: true,
  },
  {
    path: "/settings/general",
    element: GeneralSettings,
    hideInMenu: true,
  },
  {
    path: "/settings/woocommerce",
    element: WooCommerceSettings,
    hideInMenu: true,
  },
  {
    path: "/settings/custom-field",
    element: CustomFieldSettings,
    hideInMenu: true,
  },
  {
    path: "/settings/smtp",
    element: SmtpSettings,
    hideInMenu: true,
  },
];

export default routes;
