import _ from "lodash";
import React, { useEffect, useState } from "react";

import SettingsNav from "./SettingsNav";
import SingleSocialMedia from "./SingleSocialMedia";
import LoadingIndicator from "../../components/LoadingIndicator";

import PlusIcon from "../../components/Icons/Plus";
import ProfilePhotoPlaceholderIcon from "../../components/Icons/ProfilePhotoPlaceholderIcon";
import SettingIcon from "../../components/Icons/SettingIcon";
import UploadIcon from "../../components/Icons/UploadIcon";

import SuccessfulNotification from "../../components/SuccessfulNotification";
import { ClearNotification } from "../../utils/admin-notification";
import { AdminNavMenuClassChange } from "../../utils/admin-settings";

export default function BusinessSettings() {
  // Admin active menu selection
  AdminNavMenuClassChange("mrm-admin", "settings");
  _.noConflict();
  let frame;
  const [tabState, setTabState] = useState(1);
  const [socialMedia, setSocialMedia] = useState([]);
  const [saveLoader, setsaveLoader] = useState(false);
  const [showNotification, setShowNotification] = useState("none");
  const [notificationType, setNotificationType] = useState("success");
  const [message, setMessage] = useState("");
  const [showAlert, setShowAlert] = useState("none");
  const [showLoader, setShowLoader] = useState(true);

  //---business settings tab-----
  const toggleTab = (index) => {
    setTabState(index);
  };

  //------add social media-------
  const addSocialMedia = (value) => {
    setSocialMedia((prevState) => {
      return [
        ...prevState,
        {
          icon: "",
          url: "",
        },
      ];
    });
  };
  const [businessName, setBusinessName] = useState("");
  const handleBusinessName = (event) => {
    setBusinessName(event.target.value);
  };
  const [phoneNumber, setPhoneNumber] = useState("");
  const handlePhoneNumber = (event) => {
    setPhoneNumber(event.target.value);
  };
  const [businessAddress, setBusinessAddress] = useState("");
  const handleBusinessAddress = (event) => {
    setBusinessAddress(event.target.value);
  };
  const [businessLogo, setBusinessLogo] = useState("");
  const [buttonDisable, setButtonDisabled] = useState(false);
  const saveBusiness = async () => {
    setsaveLoader(true);
    setButtonDisabled(true);
    const post_data = {
      business_name: businessName,
      phone: phoneNumber,
      address: businessAddress,
      logo_url: businessLogo,
      socialMedia,
    };

    const res = await fetch(
      `${window.MRM_Vars.api_base_url}mrm/v1/settings/business`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(post_data),
      }
    );
    const responseData = await res.json();

    if (true === responseData.success) {
      setButtonDisabled(false);
      setNotificationType("success");
      setShowNotification("block");
      setMessage(responseData?.message);
      setsaveLoader(false);
    } else if (false === responseData.success) {
      setButtonDisabled(false);
      setNotificationType("warning");
      setShowNotification("block");
      setMessage(responseData?.message);
      setsaveLoader(false);
    }
    ClearNotification("none", setShowNotification);
    return () => clearTimeout(timer);
  };

  useEffect(() => {
    const getBusinessData = async () => {
      setShowLoader(true);

      const res = await fetch(
        `${window.MRM_Vars.api_base_url}mrm/v1/settings/business`
      );
      const resJson = await res.json();
      if( resJson.success == true){
        setBusinessAddress(resJson.address)
        setPhoneNumber(resJson.phone)
        setBusinessName(resJson.business_name)
        setBusinessLogo(resJson.logo_url)
        setSocialMedia(resJson.socialMedia)

        setShowLoader(false);
      }
    };
    getBusinessData();
  }, []);

  
  //-------logo upload from wp media--------
  const addBusinessLogo = (event) => {
    event.preventDefault()

    // If the media frame already exists, reopen it.
    if (frame) {
      frame.open()
      return
    }

    // Create a new media frame
    frame = wp.media({
      library : {
        type : 'image',
      },
      title: 'Select or Upload Media',
      button: {
        text: 'Add This Photo',
      },
      multiple: false,
    })

    // Finally, open the modal on click
    frame.on('select', function () {
        var attachment = frame.state().get('selection').first().toJSON();
        document.getElementById("preview-img-link").value = attachment.id;
        
        if(businessLogo){
          document.getElementById("preview-img-src").src = attachment.url;
        }
        
        setBusinessLogo(attachment.url)
    });

    frame.open();
    return false;
  }

  //------Delete social media-------
  const deleteSocialLogo = (index) => {
    setSocialMedia([
      ...socialMedia.slice(0, index),
      ...socialMedia.slice(index + 1, socialMedia.length),
    ]);
  };

  const handleSocialUrl = (singleSocialMedia, val, index) => {
    singleSocialMedia.icon = singleSocialMedia.icon;
    singleSocialMedia.url = val.target.value;
    const modifiedOption = socialMedia.map((value, thisIndex) => {
      if (index === thisIndex) {
        value = { ...socialMedia[index], ...singleSocialMedia };
      }
      return value;
    });
    setSocialMedia(modifiedOption);
  };
  const handleSocialIcon = (singleSocialMedia, val, index) => {
    singleSocialMedia.url = singleSocialMedia.url;
    singleSocialMedia.icon = val;
    const modifiedOption = socialMedia.map((value, thisIndex) => {
      if (index === thisIndex) {
        value = { ...socialMedia[index], ...singleSocialMedia };
      }
      return value;
    });
    setSocialMedia(modifiedOption);
  };

  return (
    <>
      <div className="mintmrm-settings-page">
        <div className="mintmrm-container">
          <div className="mintmrm-settings">
            <h2 class="conatct-heading">Settings</h2>

            <div className="mintmrm-settings-wrapper">
              <SettingsNav/>

              <div className="settings-tab-content pos-relative">
                {showLoader ? (
                  <LoadingIndicator type="table" />
                ) : (
                  <div className="single-tab-content business-tab-content">
                    <div className="tab-body">
                      <header className="tab-header">
                        <h4 className="title">
                          <SettingIcon />
                          Business Settings
                        </h4>
                      </header>

                      <nav className="business-settings-tab-nav">
                        <button type="button" className={tabState === 1 ? "active" : ""} onClick={() => toggleTab(1)} >Basic Settings</button>
                        <button type="button" className={tabState === 2 ? "active" : ""} onClick={() => toggleTab(2)} >Social Media</button>
                      </nav>

                      <div className={ tabState === 1 ? "form-wrapper business-settings-wrapper active" : "form-wrapper business-settings-wrapper" }>
                        <div className="form-group">
                          <label htmlFor="business-name">Business Name</label>
                          <input type="text" name="business-name" id="business-name" placeholder="Enter Business Name" value={businessName} onChange={handleBusinessName} />
                        </div>

                        <div className="form-group">
                          <label htmlFor="phone-number">Phone Number</label>
                          <input type="text" name="phone-number" id="phone-number" placeholder="Enter Phone Number" value={phoneNumber} onChange={handlePhoneNumber} />
                        </div>

                        <hr />

                        <div className="form-group top-align">
                          <label htmlFor="business-address">Business Address</label>
                          <textarea name="business-address" id="business-address" cols="30" rows="3" placeholder="Enter Business Address " onChange={handleBusinessAddress} value={businessAddress}></textarea>
                        </div>

                        <hr />

                        <div className="form-group top-align photo-upload">
                          <label htmlFor="upload-logo">Upload Logo</label>

                          <div className="photo-area">
                            <div className="preview-img">
                              <input type="hidden" id="preview-img-link" value="" />
                              {businessLogo != '' && 
                                <img src={businessLogo} id="preview-img-src" alt="logo" />
                              }
                              {businessLogo == '' && 
                                <ProfilePhotoPlaceholderIcon/>
                              }
                            </div>

                            <div className="upload-area">
                              <button onClick={addBusinessLogo} type="button">
                                <span className="icon">
                                  <UploadIcon/>
                                </span>
                                <span className="title"><mark>Click to upload</mark>
                                {/* and drag and drop <br /> SVG, PNG JPG or GIF (max. 800x400px)  */}
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>

                      </div>

                      <div className={ tabState === 2 ? "form-wrapper social-settings-wrapper active" : "form-wrapper social-settings-wrapper" } >
                        <div className="form-header">
                          <h4>Social Media</h4>
                          <button type="button" className="mintmrm-btn" title="Add a social media" onClick={addSocialMedia} >
                            <PlusIcon/>
                            Add
                          </button>
                        </div>
                        <div className="social-media-wrapper">
                          {socialMedia.map((singleSocialMedia, idx) => {
                            return (
                              <SingleSocialMedia
                              key={idx}
                              index={idx}
                              icon ={singleSocialMedia.icon}
                              url ={singleSocialMedia.url}
                              data = {singleSocialMedia}
                              handleSocialUrl = {handleSocialUrl}
                              handleSocialIcon = {handleSocialIcon}
                              deleteSocialLogo={deleteSocialLogo}
                              />
                            );
                          })}
                        </div>
                      </div>

                    </div>

                    <div className="tab-footer">
                      <button className="mintmrm-btn" type="button"  onClick={saveBusiness} disabled={saveLoader ? true : false} >
                        Save Settings
                        { saveLoader && 
                          <span className="mintmrm-loader"></span>
                        }
                      </button>
                    </div>

                  </div>
                )}
              </div>
              {/* end settings-tab-content */}

            </div>

          </div>
          <SuccessfulNotification
              display={showNotification}
              setShowNotification={setShowNotification}
              message={message}
              notificationType={notificationType}
              setNotificationType={setNotificationType}
          />
        </div>
      </div>
    
    </>
  );
}
