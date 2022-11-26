/**
 * WordPress dependencies
 */
import "@wordpress/editor"; // This shouldn't be necessary
import "@wordpress/format-library";
import { useSelect, useDispatch } from "@wordpress/data";
import { useEffect, useState, useMemo } from "@wordpress/element";
import { serialize, parse } from "@wordpress/blocks";
import { uploadMedia } from "@wordpress/media-utils";
import { SlotFillProvider, Popover ,Button } from "@wordpress/components";

import PlusIcon from "../Icons/PlusIcon";

import {
  BlockEditorKeyboardShortcuts,
  BlockEditorProvider,
  BlockList,
  BlockInspector,
  WritingFlow,
  ObserveTyping,
  BlockTools,
} from "@wordpress/block-editor";
/**
 * Internal dependencies
 */
import Sidebar from "../sidebar";
import { Inserter } from "../inserter";
import { ShortcutProvider } from "@wordpress/keyboard-shortcuts";

function BlockEditor({ settings: _settings }) {
  const location = window.location.hash;
  var locationArray = location.split("/");
  const lastIndex = locationArray.at(-1);
  const id = lastIndex.replace("#", "");
  const [blocks, updateBlocks] = useState([]);
  const [showAll, updateShowAll] = useState(false);
  const { createInfoNotice } = useDispatch("core/notices");

  const canUserCreateMedia = useSelect((select) => {
    const _canUserCreateMedia = select("core").canUser("create", "media");
    return _canUserCreateMedia || _canUserCreateMedia !== false;
  }, []);

  const defaultData =
    "<!-- wp:mrmformfield/email-field-block -->\n" +
    '<div class="mrm-form-group email" style="margin-bottom:12px"><label for="mrm-email" style="color:#363B4E;margin-bottom:7px"></label><div class="input-wrapper"><input type="email" name="email" id="mrm-email" placeholder="Email" required style="background-color:#ffffff;color:#7A8B9A;border-radius:5px;padding-top:11px;padding-right:14px;padding-bottom:11px;padding-left:14px;border-style:solid;border-width:1px;border-color:#DFE1E8" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$"/></div></div>\n' +
    "<!-- /wp:mrmformfield/email-field-block -->\n" +
    "\n" +
    "<!-- wp:mrmformfield/mrm-button-block -->\n" +
    '<div class="mrm-form-group submit" style="margin-bottom:12px;text-align:left"><button class="mrm-submit-button mintmrm-btn" type="submit" style="background-color:;color:;border-radius:5px;padding:15px 20px;line-height:1;letter-spacing:0;border-style:none;font-size:15px;border-width:0;border-color:;width:%">Submit</button></div>\n' +
    "<!-- /wp:mrmformfield/mrm-button-block -->";

  const settings = useMemo(() => {
    if (!canUserCreateMedia) {
      return _settings;
    }
    return {
      ..._settings,
      mediaUpload({ onError, ...rest }) {
        uploadMedia({
          wpAllowedMimeTypes: _settings.allowedMimeTypes,
          onError: ({ message }) => onError(message),
          ...rest,
        });
      },
    };
  }, [canUserCreateMedia, _settings]);

  useEffect(() => {
    const getFormData = async () => {
      if (id) {
        const res = await fetch(
          `${window.MRM_Vars.api_base_url}mrm/v1/forms/get-form-body/${id}`
        );
        const resJson = await res.json();
        if (200 === resJson.code) {
          window.localStorage.setItem(
            "getmrmblocks",
            resJson?.data[0]?.form_body
          );
          const storedBlocks = window.localStorage.getItem("getmrmblocks");

          if (storedBlocks?.length) {
            handleUpdateBlocks(() => parse(storedBlocks));
          }
        } else {
          handleUpdateBlocks(() => parse(defaultData));
          window.localStorage.setItem("getmrmblocks", defaultData);
        }
      } else {
        handleUpdateBlocks(() => parse(defaultData));
        window.localStorage.setItem("getmrmblocks", defaultData);
      }
    };
    getFormData();
  }, []);

  const SettingPlanelShowHide = () => {
    if ("show" === localStorage.settingsPannel) {
      const el = document.getElementsByClassName("getdave-sbe-block-editor");
      el[0].classList.remove("show-settings-pannel");
      localStorage.setItem("settingsPannel", "hide");
    }
  };

  /**
   * Wrapper for updating blocks. Required as `onInput` callback passed to
   * `BlockEditorProvider` is now called with more than 1 argument. Therefore
   * attempting to setState directly via `updateBlocks` will trigger an error
   * in React.
   */
  function handleUpdateBlocks(blocks) {
    updateBlocks(blocks);
  }
  function handleUpdateBlocksByOnInput(blocks) {
    updateBlocks(blocks);
    window.localStorage.setItem("getmrmblocks", serialize(blocks));
  }

  function handlePersistBlocks(newBlocks) {
    updateBlocks(newBlocks);
    window.localStorage.setItem("getmrmblocks", serialize(newBlocks));
  }
  function handleShowAll(){
    updateShowAll(!showAll)

  }
  return (
    <div className="get-mrm-block-editor">
      <Button 
       className={showAll ? 'active' : '' }
       onClick={handleShowAll}>
        <PlusIcon />
      </Button>
      
      <ShortcutProvider>
        <BlockEditorProvider
          value={blocks}
          onInput={handleUpdateBlocksByOnInput}
          onChange={handlePersistBlocks}
          settings={settings}
        >
          <div className={showAll ? 'mrm-block-editor-wrapper show-all-block' : 'mrm-block-editor-wrapper' } >
            <div className="interface-interface-skeleton__secondary-sidebar">
              <Inserter setIsInserterOpened={true} />
            </div>
            
            <Sidebar.InspectorFill>
              <BlockInspector />
            </Sidebar.InspectorFill>

            <div className="editor-styles-wrapper">
              <BlockEditorKeyboardShortcuts />
              <BlockTools>
                <WritingFlow>
                  <ObserveTyping>
                    <BlockList className="get-mrm-block-editor__block-list" />
                  </ObserveTyping>
                </WritingFlow>
              </BlockTools>
              <Popover.Slot />
            </div>

          </div>

        </BlockEditorProvider>
      </ShortcutProvider>
    </div>
  );
}

export default BlockEditor;
