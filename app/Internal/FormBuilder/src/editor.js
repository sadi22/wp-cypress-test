/**
 * WordPress dependencies
 */
import {
  Popover,
  SlotFillProvider,
  DropZoneProvider,
  FocusReturnProvider,
} from "@wordpress/components";

import { InterfaceSkeleton, FullscreenMode } from "@wordpress/interface";

/**
 * Internal dependencies
 */
import Notices from "./components/notices";
import Header from "./components/header";
import Sidebar from "./components/sidebar";
import BlockEditor from "./components/block-editor";
import { Fragment } from "@wordpress/element";
import { BrowserRouter } from "react-router-dom";



function Editor({ settings }) {
  return (
    <div className="mrm-editor-builder">
        <FullscreenMode isActive={false} />
        <SlotFillProvider>
          <InterfaceSkeleton
            header={<Header />}
            sidebar={<Sidebar />}
            content={
              <>
                <Notices />
                <BlockEditor settings={settings} />
              </>
            }
          />

          <Popover.Slot />
        </SlotFillProvider>
    </div>
  );
}

export default Editor;
