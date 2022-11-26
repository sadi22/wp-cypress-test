import React, { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import ImportNavbar from "../components/Import/ImportNavbar";
import InputItem from "../components/InputItem";
import Search from "../components/Icons/Search";
import Plus from "../components/Icons/Plus";
import CrossIcon from "../components/Icons/CrossIcon";

export default function ImportMailchimp() {
  const [errorMessage, setErrorMessage] = useState(false);
  const [isAddColumn, setIsAddColumn] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const navigate = useNavigate();

  // stores the text data
  const [apiKey, setApiKey] = useState("11b321614d43814ca7d8406041bb3839-us8");

  // stores available lists as selectbox options from mailchimp
  const [listsOptions, setListsOptions] = useState([]);

  // stores currently selected lists
  const [selectedLists, setSelectedLists] = useState([]);

  // function to handle changes in the input text
  function handleChange(event) {
    setApiKey(event.target.value);
  }

  // handle selectbox new items currently selected
  function handleSelectBox(e, name) {
    const updatedOptions = [...e.target.options]
      .filter((option) => option.selected)
      .map((x) => x.value);
    setSelectedLists(updatedOptions);
  }
  // Funtion to get mailchimp available lists for selection
  async function getLists() {
    if (!apiKey) {
      window.alert("Please Enter a valid API Key");
      return;
    }
    let options = {
      method: "POST",
      body: JSON.stringify({
        key: apiKey,
      }),
      headers: {
        "Content-type": "application/json",
      },
    };
    setIsVerified(true);
  }

  // if a list is selected, send the user to map page
  function goToMapPage() {
    navigate("/contacts/import/mailchimp/map", {
      state: {
        data: resJson.data,
        type: "mailchimp", // indicated the type of import
      },
    });
  }

  const showLists = () => {
    setIsAddColumn(!isAddColumn);
  };

  return (
    <div className="mintmrm-import-page">
      <div className="mintmrm-header">
        <div className="contact-details-breadcrumb import-contact-breadcrum">
          <div className="import-cotainer">
            <div className="mintmrm-container">
              <ul className="mintmrm-breadcrumb">
                <li>
                  <Link to={`../contacts`}>Contact</Link>
                </li>
                <li className="active">Import</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="mintmrm-container">
        <div className="import-wrapper">
          <ImportNavbar />

          <div className="import-tabs-content upload-section">
            <h3>Import from MailChimp</h3>
            <span className="csv-title">
              Find your MailChimp API key in our
              <a href=""> documentation.</a>
            </span>
            <div className="import-form-wrapper">
              <div className="form-group contact-input-field">
                <label htmlFor="" aria-required>
                  MailChimp API Key
                </label>
                <div className="input-key-wrapper">
                  <input
                    type="text"
                    name="mailchimp-api-key"
                    onChange={handleChange}
                    value={apiKey}
                  />
                  <button
                    className="contact-save mintmrm-btn"
                    onClick={getLists}
                  >
                    Verify
                  </button>
                </div>
                <p
                  className={
                    errorMessage ? "error-message show" : "error-message"
                  }
                ></p>
              </div>
            </div>
            {listsOptions.length > 0 && (
              <div className="import-form-wrapper">
                {/* <Selectbox
                  label="Lists"
                  name="Lists"
                  options={listsOptions}
                  tags={false}
                  placeholder="Select Lists for importing"
                  multiple={true}
                  onSelect={handleSelectBox}
                  onRemove={handleSelectBox}
                /> */}
              </div>
            )}
            <div className={isVerified ? "add-list show" : "add-list"}>
              <div className="select-list pos-relative">
                <div
                  className={
                    isAddColumn
                      ? "select-btn selected show"
                      : "select-btn selected"
                  }
                  onClick={showLists}
                >
                  <span className="selected-items">
                    Product Feed
                    <CrossIcon />
                  </span>
                  <span className="selected-items">
                    WPVR
                    <CrossIcon />
                  </span>
                </div>
                <div
                  className={isAddColumn ? "select-btn show" : "select-btn"}
                  onClick={showLists}
                >
                  Select List
                </div>
                <ul
                  className={
                    isAddColumn ? "mintmrm-dropdown show" : "mintmrm-dropdown"
                  }
                >
                  <li className="searchbar">
                    <span class="pos-relative">
                      <Search />
                      <input
                        type="search"
                        name="column-search"
                        placeholder="Search..."
                      />
                    </span>
                  </li>

                  <li className="list-title">Choose columns</li>

                  <Link className="add-action" to="">
                    <Plus />
                    Add Column
                  </Link>

                  {/* {contactListColumns.map((column, index) => {
                  <li className="single-column">
                    <ColumnList title={column.title} key={index} />
                  </li>;
                })} */}

                  {/* <li className="button-area">
              <button className="mintmrm-btn outline default-btn">
                Default
              </button>
              <button className="mintmrm-btn outline cancel-btn">
                Cancel
              </button>
              <button className="mintmrm-btn save-btn">Save</button>
            </li> */}
                </ul>
              </div>
            </div>
            <div className="csv-save-button">
              {/* {selectedLists.length > 0 && (
                <button className="contact-save mintmrm-btn" onClick={getLists}>
                  Save
                </button>
              )} */}
              <button className="contact-save mintmrm-btn" onClick={getLists}>
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
