import domReady from "@wordpress/dom-ready";
import { render } from "@wordpress/element";
import { registerCoreBlocks } from "@wordpress/block-library";
import Editor from "./editor";
const { registerBlockType} = wp.blocks;
const { __ } = wp.i18n;
import "./styles.scss";
//Email
import icon from "./components/email-field-block/icon";
import attributes from "./components/email-field-block/attributes";
import Edit from "./components/email-field-block/edit";
import mrmEmailField from "./components/email-field-block/block";
// Firstname
import mrmFirstName from "./components/first-name-block/block";
import firstNameIcon from "./components/first-name-block/icon";
import firstNameAttributes from "./components/first-name-block/attributes";
import firstNameEdit from "./components/first-name-block/edit";
//last Name
import mrmLastName from "./components/last-name-block/block";
import lastNameIcon from "./components/last-name-block/icon";
import lastNameAttributes from "./components/last-name-block/attributes";
import lastNameEdit from "./components/last-name-block/edit";
//Button
import mrmButton from "./components/mrm-button-block/block";

import ButtonIcon from "./components/mrm-button-block/icon";
import ButtonAttributes from "./components/mrm-button-block/attributes";
import ButtonEdit from "./components/mrm-button-block/edit";
// Custom Field
import mrmCustomField from "./components/mrm-custom-field/block";
import CustomFieldIcon from "./components/mrm-custom-field/icon";
import CustomFieldAttributes from "./components/mrm-custom-field/attributes";
import CustomFieldEdit from "./components/mrm-custom-field/edit";

domReady(function () {
  const settings = window.getmrmsetting || {};
  registerCoreBlocks();
  registerBlockType("mrmformfield/email-field-block", {
    title: __("Email Field", "mrm"),
    category: "common",
    icon: icon.EmailField,
    supports: {
      align: ["left", "right", "center"],
    },
    attributes: attributes,
    edit: Edit,
    save: mrmEmailField,
  });

  registerBlockType("mrmformfield/first-name-block", {
    title: __("First Name", "mrm"),
    category: "common",
    icon: firstNameIcon.firstName,
    supports: {
      align: ["left", "right", "center"],
    },
    attributes: firstNameAttributes,
    edit: firstNameEdit,
    save: mrmFirstName,
  });

  registerBlockType("mrmformfield/last-name-block", {
    title: __("Last Name", "mrm"),
    category: "common",
    icon: lastNameIcon.lastName,
    supports: {
      align: ["left", "right", "center"],
    },
    attributes: lastNameAttributes,
    edit: lastNameEdit,
    save: mrmLastName,
  });

  registerBlockType("mrmformfield/mrm-button-block", {
    title: __("MRM Button", "mrm"),
    category: "common",
    icon: ButtonIcon.Button,
    // supports: {
    //   align: ["left", "right", "center"],
    // },
    attributes: ButtonAttributes,
    edit: ButtonEdit,
    save: mrmButton,
  });

  registerBlockType("mrmformfield/mrm-custom-field", {
    title: __("MRM Custom Field", "mrm"),
    category: "common",
    icon: CustomFieldIcon.CustomField,
    supports: {
      align: ["left", "right", "center"],
    },
    attributes: CustomFieldAttributes,
    edit: CustomFieldEdit,
    save: mrmCustomField,
  });
  const el = document.getElementById("mrm-block-editor");
  if (el !== null) {
    render(<Editor settings={settings} />, el);
  }
});
