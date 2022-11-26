const attributes = {
  formLayout: {
    type: "string",
    default: "",
  },
  firstName: {
    type: "boolean",
    default: false,
  },
  firstNameLabel: {
    type: "string",
    default: "First Name",
  },
  firstNamePlaceholder: {
    type: "string",
    default: "First Name",
  },
  isRequiredName: {
    type: "boolean",
    default: false,
  },

  lastName: {
    type: "boolean",
    default: false,
  },
  lastNameLabel: {
    type: "string",
    default: "Last Name",
  },
  lastNamePlaceholder: {
    type: "string",
    default: "Last Name",
  },
  isRequiredLastName: {
    type: "boolean",
    default: false,
  },
  typography: {
    type: "object",
    default: {},
    style: [{ selector: "mrm-form-group.submit .mrm-submit-button" }],
  },

  emailLabel: {
    type: "string",
    default: "",
  },
  emailPlaceholder: {
    type: "string",
    default: "Email",
  },

  phone: {
    type: "boolean",
    default: false,
  },
  phoneLabel: {
    type: "string",
    default: "Phone",
  },
  phonePlaceholder: {
    type: "string",
    default: "Phone",
  },
  isRequiredPhone: {
    type: "boolean",
    default: false,
  },

  websiteUrl: {
    type: "boolean",
    default: false,
  },
  websiteUrlLabel: {
    type: "string",
    default: "Website Url",
  },
  websiteUrlPlaceholder: {
    type: "string",
    default: "Website Url",
  },
  isRequiredWebsiteUrl: {
    type: "boolean",
    default: false,
  },

  message: {
    type: "boolean",
    default: false,
  },
  messageLabel: {
    type: "string",
    default: "Message",
  },
  messagePlaceholder: {
    type: "string",
    default: "Write your message here...",
  },
  isRequiredMessage: {
    type: "boolean",
    default: false,
  },

  acceptance_checkbox: {
    type: "boolean",
    default: false,
  },
  acceptanceCheckboxText: {
    type: "string",
    default: "I have read and agree the Terms & Condition.",
  },
  isRequiredAcceptance: {
    type: "boolean",
    default: false,
  },

  registration_checkbox: {
    type: "boolean",
    default: false,
  },
  data_to_checkout: {
    type: "boolean",
    default: false,
  },
  registration_permission: {
    type: "boolean",
    default: false,
  },
  registrationPermissionCheckboxText: {
    type: "string",
    default: "I agree to be registered as a subscriber.",
  },
  inputFieldIcon: {
    type: "boolean",
    default: true,
  },
  fieldLabel: {
    type: "boolean",
    default: false,
  },
  requiredMark: {
    type: "boolean",
    default: true,
  },
  enable_recaptcha: {
    type: "boolean",
    default: false,
  },
  recaptcha_site_key: {
    type: "string",
    default: "",
  },
  recaptcha_secret_key: {
    type: "string",
    default: "",
  },
  recapcha_token: {
    type: "string",
    default: "",
  },

  rowSpacing: {
    type: "number",
    default: 12,
  },

  labelTypography: {
    type: "object",
    default: {},
    style: [{ selector: ".wpfnl-optin-form .wpfnl-optin-form-group > label" }],
  },
  labelColor: {
    type: "string",
    default: "#363B4E",
  },
  labelSpacing: {
    type: "number",
    default: 7,
  },

  inputTypography: {
    type: "object",
    default: {},
    style: [
      {
        selector:
          ".wpfnl-optin-form .wpfnl-optin-form-group input[type=text], .wpfnl-optin-form .wpfnl-optin-form-group input[type=email]",
      },
    ],
  },
  device: {
    type: "string",
    default: "md",
  },
  inputTextColor: {
    type: "string",
    default: "#7A8B9A",
  },
  inputBgColor: {
    type: "string",
    default: "#ffffff",
  },
  inputBorderRadius: {
    type: "number",
    default: 5,
  },
  inputPaddingTop: {
    type: "integer",
    default: 11,
  },
  inputPaddingRight: {
    type: "integer",
    default: 14,
  },
  inputPaddingBottom: {
    type: "integer",
    default: 11,
  },
  inputPaddingLeft: {
    type: "integer",
    default: 14,
  },
  inputBorderStyle: {
    type: "string",
    default: "solid",
  },
  inputBorderWidth: {
    type: "number",
    default: 1,
  },
  inputBorderColor: {
    type: "string",
    default: "#DFE1E8",
  },

  buttonTypography: {
    type: "object",
    default: {},
    style: [
      { selector: ".wpfnl-optin-form .wpfnl-optin-form-group .btn-default" },
    ],
  },
  buttonTextColor: {
    type: "string",
    default: "",
  },
  buttonBgColor: {
    type: "string",
    default: "",
  },
  buttonHvrTextColor: {
    type: "string",
    default: "",
  },
  buttonHvrBgColor: {
    type: "string",
    default: "",
  },
  buttonBorderRadius: {
    type: "number",
    default: 5,
  },
  buttonPaddingTop: {
    type: "integer",
    default: 12,
  },
  buttonPaddingRight: {
    type: "integer",
    default: 20,
  },
  buttonPaddingBottom: {
    type: "integer",
    default: 13,
  },
  buttonPaddingLeft: {
    type: "integer",
    default: 20,
  },
  buttonBorderStyle: {
    type: "string",
    default: "none",
  },
  buttonBorderWidth: {
    type: "number",
    default: 1,
  },
  buttonBorderColor: {
    type: "string",
    default: "",
  },
  buttonHvrBorderColor: {
    type: "string",
    default: "",
  },
  buttonText: {
    type: "string",
    default: "Submit",
  },
  buttonAlign: {
    type: "string",
    default: "center",
  },

  postAction: {
    type: "string",
    default: "notification",
  },
  notification: {
    type: "string",
    default: "",
  },
  redirect_action: {
    type: "string",
    default: "next_step",
  },
  redirect_url: {
    type: "string",
    default: "",
  },

  adminEmail: {
    type: "string",
    default: "",
  },
  emailSubject: {
    type: "string",
    default: "",
  },
  customFieldTitle: {
    type: "",
    default: "New Field",
  },
  customFieldSlug: {
    type: "",
    default: "Field Slug",
  },
};

export default attributes;
