/**
 * External dependencies
 */
import { Button } from "@arco-design/web-react";
import axios from "axios";
import { FormApi } from "final-form";
import { cloneDeep, isEqual } from "lodash";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "@arco-themes/react-easy-email-theme-purple/css/arco.css";
import "easy-email-editor/lib/style.css";
import "easy-email-extensions/lib/style.css";
import mjml from "mjml-browser";
import mustache from "mustache";
import "./styles/common.scss";

/**
 * internal dependencies
 */
import {
  DesktopEmailPreview,
  EditEmailPreview,
  EmailEditorProvider,
  IEmailTemplate,
  MobileEmailPreview,
} from "easy-email-editor";

import { ExtensionProps, StandardLayout } from "easy-email-extensions";

import { AdvancedType, IBlockData, JsonToMjml } from "easy-email-core";

import { copy } from "./utils/copy";

import "./CustomBlocks";

//----icon components----
import CrossIcon from "./Icon/CrossIcon";
import DesktopIcon from "./Icon/DesktopIcon";
import DoubleAngleLeftIcon from "./Icon/DoubleAngleLeftIcon";
import EditIcon from "./Icon/EditIcon";
import MobileIcon from "./Icon/MobileIcon";
import MoreOptionIcon from "./Icon/MoreOptionIcon";

const defaultCategories: ExtensionProps["categories"] = [
  {
    label: "Content",
    active: true,
    blocks: [
      {
        type: AdvancedType.TEXT,
      },
      {
        type: AdvancedType.IMAGE,
        payload: { attributes: { padding: "0px 0px 0px 0px" } },
      },
      {
        type: AdvancedType.BUTTON,
      },
      {
        type: AdvancedType.SOCIAL,
      },
      {
        type: AdvancedType.DIVIDER,
      },
      {
        type: AdvancedType.SPACER,
      },
      {
        type: AdvancedType.HERO,
      },
      {
        type: AdvancedType.WRAPPER,
      },
    ],
  },
  {
    label: "Layout",
    active: true,
    displayType: "column",
    blocks: [
      {
        title: "1 column",
        payload: [[["25%", "25%", "25%", "25%"]]],
      },
      {
        title: "2 columns",
        payload: [
          ["50%", "50%"],
          ["33%", "67%"],
          ["67%", "33%"],
          ["25%", "75%"],
          ["75%", "25%"],
        ],
      },
      {
        title: "3 columns",
        payload: [
          ["33.33%", "33.33%", "33.33%"],
          ["25%", "25%", "50%"],
          ["50%", "25%", "25%"],
        ],
      },
      {
        title: "4 columns",
        payload: [
          ["25%", "25%", "25%", "25%"],
          ["20%", "20%", "30%", "30%"],
        ],
      },
    ],
  },
];

const fontList = [
  "Arial",
  "Tahoma",
  "Verdana",
  "Times New Roman",
  "Courier New",
  "Georgia",
  "Lato",
  "Montserrat",
].map((item) => ({ value: item, label: item }));

const socialIcons = [
  // colorful
  {
    content: "facebook",
    image:
      "https://assets.maocanhua.cn/a080b611-ef54-4517-a7f4-62a9de8c8c4f-5365678_fb_facebook_facebooklogo_icon.png",
  },
  {
    content: "linkedin",
    image:
      "https://assets.maocanhua.cn/e616cd72-ce70-413c-a185-e2b5ae2b64f4-5296501_linkedin_network_linkedinlogo_icon.png",
  },
  {
    content: "instagram",
    image:
      "https://assets.maocanhua.cn/e0f0e4b4-8aef-4c49-a9e4-dbfe8e0cb4d6-instagram.png",
  },
  {
    content: "pinterest",
    image:
      "https://assets.maocanhua.cn/4c53ff96-ad2f-4cdc-9e63-0f8b0ba52f10-5296503_inspiration_pin_pinned_pinterest_socialnetwork_icon.png",
  },
  {
    content: "youtube",
    image:
      "https://assets.maocanhua.cn/9b25a927-763c-43e2-8557-63f7225ad11a-5296521_play_video_vlog_youtube_youtubelogo_icon.png",
  },
  {
    content: "twitter",
    image:
      "https://assets.maocanhua.cn/07ae33c6-3feb-4424-a378-39031d2b63d4-5296516_tweet_twitter_twitterlogo_icon.png",
  },
  {
    content: "tiktok",
    image:
      "https://assets.maocanhua.cn/59102950-e1dc-41a4-b1c5-c0890f064673-7024783_tiktok_socialmedia_icon.png",
  },
  {
    content: "tumblr",
    image:
      "https://assets.maocanhua.cn/fcbc85b0-ccbf-4f5f-a9d7-067f16691a56-5296511_network_socialnetwork_tumblr_tumblrlogo_icon.png",
  },
];

export default function Editor(props) {
  const {
    selectedEmailIndex,
    emailData,
    isNewCampaign,
    campaignData,
    setIsTemplate,
    setIsCloseBuilder,
    refresh,
    setRefresh,
  } = props;

  const [campaignId, setCampaignId] = useState(0);

  const [dataSource, setDataSource] = useState({
    productsList: [],
  });

  let navigate = useNavigate();

  const [isDarkMode, setIsDarkMode] = useState(false);

  const [showMore, setShowMore] = useState(false);

  const [activePreview, setActivePreview] = useState("edit");

  const [builderData, setBuilderData] = useState(null);

  const [shouldCallAPI, setShouldCallAPI] = useState(true);

  const [emailLoader, setEmailLoader] = useState(false);

  const [testMailModal, setTestMailModal] = useState(false);
  const [testMailLoader, setTestMailLoader] = useState(false);
  const [testMailMessageColor, setTestMailMessageColor] = useState("");

  const [testEmail, setTestEmail] = useState("");
  const [testMailMessage, setTestMailMessage] = useState("");

  let defaultValues = {
    type: "page",
    subject: "Welcome to MINT CRM email",
    subTitle: "Nice to meet you!",
    content: {
      type: "page",
      data: {
        value: {
          breakpoint: "480px",
          headAttributes: "",
          "font-size": "14px",
          "line-height": "1.7",
          headStyles: [],
          fonts: [],
          responsive: true,
          "font-family": "lucida Grande,Verdana,Microsoft YaHei",
          "text-color": "#000000",
        },
      },
      attributes: {
        "background-color": "#F4F4F4",
        width: "600px",
        "css-class": "mjml-body",
      },
      children: [],
    },
  };

  const { id } = useParams();

  /**
   * set initial value
   */
  const initialValues:
    | {
        subTitle: string;
        subject: string;
        type: string;
        content: {
          data: {
            value: {
              fonts: any[];
              headStyles: any[];
              headAttributes: string;
              responsive: boolean;
              "font-size": string;
              "line-height": string;
              "font-family": string;
              "text-color": string;
              breakpoint: string;
            };
          };
          children: any[];
          attributes: {
            "background-color": string;
            "css-class": string;
            width: string;
          };
          type: string;
        };
      }
    | IBlockData<any, any> = useMemo(() => {
    if (!builderData) return defaultValues;
    const sourceData = cloneDeep(builderData) as IBlockData;
    return sourceData;
  }, [builderData]);

  useEffect(() => {
    if (!shouldCallAPI) return;
    if (!id) return;
    fetchEmailBuilderData().then((res) => {
      setBuilderData(res?.email_data?.json_data);
    });
  });

  // enable dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.body.setAttribute("arco-theme", "dark");
    } else {
      document.body.removeAttribute("arco-theme");
    }
  }, [isDarkMode]);

  const fetchProduct = async (args) => {
    let rest_url =
      `${window.MRM_Vars.api_base_url}wp/v2/product/?` + encodeData(args);
    const response = await fetch(rest_url);
    return await response.json();
  };

  const fetchEmailBuilderData = async () => {
    setShouldCallAPI(false);

    let rest_url = `${window.MRM_Vars.api_base_url}mrm/v1/campaign/${id}/email-builder/${emailData?.id}`;
    const response = await fetch(rest_url);

    return await response.json();
  };

  /**
   * save email builder data
   *
   * @param values
   * @since 1.0.0
   */
  const saveEmailContent = async (values) => {
    const mjmlContent = JsonToMjml({
      data: values.content,
      mode: "production",
      context: values.content,
    });

    const html = mjml(mustache.render(mjmlContent, {}), {
      beautify: true,
      validationLevel: "soft",
    }).html;

    if (isNewCampaign) {
      const response = await fetch(
        `${window.MRM_Vars.api_base_url}mrm/v1/campaign/email/create`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            email_body: html,
            json_data: values,
            status: "published",
            email_index: selectedEmailIndex,
            campaign_data: campaignData,
          }),
        }
      );
      return await response.json();
    } else {
      if (emailData?.id) {
        const response = await fetch(
          `${window.MRM_Vars.api_base_url}mrm/v1/campaign/${id}/email/${emailData?.id}`,
          {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify({
              email_body: html,
              json_data: values,
              status: "published",
              email_index: emailData?.id,
              campaign_data: campaignData,
            }),
          }
        );
        return await response.json();
      } else {
        const response = await fetch(
          `${window.MRM_Vars.api_base_url}mrm/v1/campaign/${id}/email/`,
          {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify({
              email_body: html,
              json_data: values,
              status: "published",
              email_index: selectedEmailIndex,
              email_data: emailData,
            }),
          }
        );
        return await response.json();
      }
    }
  };

  /**
   * on submit hook for email builder data saving
   *
   * @since 1.0.0
   */
  const onSubmit = useCallback(
    async (
      values: IEmailTemplate,
      form: FormApi<IEmailTemplate, Partial<IEmailTemplate>>
    ) => {
      setEmailLoader(true);

      if (id) {
        const isChanged = !(
          isEqual(initialValues?.content, values.content) &&
          isEqual(initialValues?.subTitle, values?.subTitle) &&
          isEqual(initialValues?.subject, values?.subject)
        );
        if (!isChanged) {
          form.restart(values);
          setEmailLoader(false);
          return;
        }
      }
      saveEmailContent(values).then((response) => {
        setCampaignId(response.campaign_id);
        setEmailLoader(false);
      });
    },
    []
  );

  // const isSubmitting = useLoading([
  //     template.loadings.create,
  //     template.loadings.updateById,
  // ]);

  function encodeData(data) {
    return Object.keys(data)
      .map(function (key) {
        return [key, data[key]].map(encodeURIComponent).join("=");
      })
      .join("&");
  }

  // export data as HTML format
  const onExportHtml = (values: IEmailTemplate) => {
    const html = mjml(
      JsonToMjml({
        data: values.content,
        mode: "production",
        context: values.content,
      }),
      {
        beautify: true,
        validationLevel: "soft",
      }
    ).html;

    copy(html);
  };

  // export data as MJML format
  const onExportMJML = (values: IEmailTemplate) => {
    const html = JsonToMjml({
      data: values.content,
      mode: "production",
      context: values.content,
    });

    copy(html);
  };

  // on change event if user selects category from category dropdown
  // of custom product block
  const onChangeCategory = async (value) => {
    fetchProduct({ product_cat: value }).then((products) => {
      setDataSource({
        ...dataSource,
        productsList: products,
      });
    });
  };

  //-----show more option click function-------
  const showMoreOption = () => {
    setShowMore(!showMore);
  };

  const backToCampaign = (e) => {
    setRefresh(!refresh);
    if (id == undefined && !campaignId) {
      navigate(`/campaigns/create`);
    } else if (!id) {
      navigate(`/campaign/edit/${campaignId}`, {
        state: { data: "builder-saved" },
      });
    } else if (id) {
      navigate(`/campaign/edit/${id}`, {
        state: { data: "builder-saved" },
      });
    } else {
      navigate(`/campaigns/create`);
    }

    setIsCloseBuilder("none");
    setIsTemplate(false);
  };

  const sendTestMailModal = () => {
    setTestMailModal(true);
  };

  const onCancel = () => {
    setTestMailModal(false);
  };

  const onChangeEmailField = (e) => {
    setTestEmail(e.target.value);
  };

  const emailSendApi = async (values) => {
    const response = await fetch(
      `${window.MRM_Vars.api_base_url}mrm/v1/campaign/sendTest`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          json_data: values,
        }),
      }
    );
    return await response.json();
  };

  const sendTestEmail = (values: IEmailTemplate) => {
    setTestMailMessage("");
    setTestMailLoader(true);

    let mergeTagsPayload = {};

    const mjmlContent = JsonToMjml({
      data: values.content,
      mode: "production",
      context: values.content,
    });

    const html = mjml(mustache.render(mjmlContent, mergeTagsPayload), {
      beautify: true,
      validationLevel: "soft",
    }).html;

    let mailData = {
      to: testEmail,
      subject: values.subject,
      content: html,
    };

    emailSendApi(mailData).then((response) => {
      setTestMailMessage(response.message);
      setTestMailLoader(false);

      if ("error" == response.status) {
        setTestMailMessageColor("error");
      }
    });
  };

  const onUploadImage = async (blob: Blob) => {
    const formData = new FormData();
    formData.append("image", blob);
    let url = `${window.MRM_Vars.api_base_url}mrm/v1/campaign/mediaUpload`;
    const res = await axios.post(url, formData);
    return res.data.url;
  };

  return (
    <>
      {emailLoader && (
        <div className="email-builder-loader show-loader">
          <span className="mintmrm-loader"></span>
        </div>
      )}

      <div className="mrm-email-editor">
        <EmailEditorProvider
          data={initialValues}
          height={"calc(100vh - 65px)"}
          dashed={false}
          autoComplete
          enabledLogic
          fontList={fontList}
          mergeTags={dataSource}
          onChangeCategory={onChangeCategory}
          socialIcons={socialIcons}
          onSubmit={onSubmit}
          onUploadImage={onUploadImage}
        >
          {({ values }, { submit }) => {
            return (
              <>
                <div
                  className={
                    testMailModal
                      ? "mintmrm-delete-alert-wrapper show-modal"
                      : "mintmrm-delete-alert-wrapper"
                  }
                >
                  <div className="mintmrm-delete-confirmation">
                    <div className="delete-confirmation-header">
                      <h3>Send Test E-mail</h3>
                      <div className="cross-icon" onClick={onCancel}>
                        <CrossIcon />
                      </div>
                    </div>

                    <div className="delete-confirmation-body">
                      <div className="form-group">
                        <label htmlFor="">Email</label>
                        <input
                          type="email"
                          name="email"
                          placeholder="Enter a test email"
                          onChange={onChangeEmailField}
                          value={testEmail}
                        />
                      </div>
                    </div>

                    <ul className="mintmrm-delete-confirm-btn">
                      <li
                        className={
                          testMailMessageColor == "error"
                            ? "alert-message mintmrm-error"
                            : "alert-message"
                        }
                      >
                        <p>{testMailMessage}</p>
                      </li>

                      <li>
                        <button
                          className="mintmrm-btn"
                          onClick={() => sendTestEmail(values)}
                        >
                          {" "}
                          Send{" "}
                          {testMailLoader && (
                            <span className="mintmrm-loader"></span>
                          )}
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
                <div
                  className="mrm-editor-header"
                  style={{ background: "var(--color-bg-2)" }}
                >
                  <div className="header-left">
                    <Button
                      className="back-from-editor"
                      title="Back"
                      onClick={backToCampaign}
                    >
                      <DoubleAngleLeftIcon />
                    </Button>

                    <div className="responsive-check">
                      <Button
                        className={
                          activePreview == "edit"
                            ? "edit-mode active"
                            : "edit-mode"
                        }
                        title="Edit Mode"
                        onClick={(e) => setActivePreview("edit")}
                      >
                        <EditIcon />
                      </Button>

                      <Button
                        className={
                          activePreview == "pc"
                            ? "desktop-mode active"
                            : "desktop-mode"
                        }
                        title="Desktop View"
                        onClick={(e) => setActivePreview("pc")}
                      >
                        <DesktopIcon />
                      </Button>

                      <Button
                        className={
                          activePreview == "mobile"
                            ? "mobile-mode active"
                            : "mobile-mode"
                        }
                        title="Mobile View"
                        onClick={(e) => setActivePreview("mobile")}
                      >
                        <MobileIcon />
                      </Button>
                    </div>
                  </div>

                  <div className="header-right">
                    {/*<Button*/}
                    {/*  className="mood-change-btn"*/}
                    {/*  onClick={() => setIsDarkMode((v) => !v)}*/}
                    {/*  shape="circle"*/}
                    {/*  type="text"*/}
                    {/*  icon={isDarkMode ? <IconMoonFill /> : <IconSunFill />}*/}
                    {/*></Button>*/}

                    <Button
                      className={
                        showMore
                          ? "more-option show-option-list"
                          : "more-option"
                      }
                      onClick={showMoreOption}
                    >
                      <MoreOptionIcon />
                      <ul className="more-option-list">
                        <li>
                          <Button onClick={() => onExportHtml(values)}>
                            Export html
                          </Button>
                          <Button onClick={() => onExportMJML(values)}>
                            Export MJML
                          </Button>
                        </li>
                      </ul>
                    </Button>

                    <Button onClick={() => sendTestMailModal()}>
                      Send Test mail
                    </Button>
                    <Button
                      // loading={isSubmitting}
                      type="primary"
                      onClick={() => submit()}
                      disabled={props.isReadonly}
                    >
                      Next
                    </Button>
                  </div>
                </div>

                <StandardLayout
                  compact={false}
                  showSourceCode={false}
                  categories={defaultCategories}
                >
                  {"edit" === activePreview && <EditEmailPreview />}
                  {"pc" === activePreview && <DesktopEmailPreview />}
                  {"mobile" === activePreview && <MobileEmailPreview />}
                </StandardLayout>
              </>
            );
          }}
        </EmailEditorProvider>
      </div>
    </>
  );
}
