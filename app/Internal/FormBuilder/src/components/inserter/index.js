import { useSelect } from '@wordpress/data';
import { close } from '@wordpress/icons';
import { Button } from '@wordpress/components';
import { __experimentalLibrary as Library } from '@wordpress/block-editor';



export function Inserter({ setIsInserterOpened }) {
    // const insertPoint = useSelect(
    //     (sel) => sel('mrm-form-builder').getInserterPanelInsertPoint(),
    //     [],
    // );
    return (
        <div className="edit-post-editor__inserter-panel">
            {/* <div className="edit-post-editor__inserter-panel-header">
                <Button icon={close} onClick={() => setIsInserterOpened(false)} />
            </div> */}
            <div className="edit-post-editor__inserter-panel-content">
                <Library
                    showMostUsedBlocks
                    showInserterHelpPanel={false}
                />
            </div>
        </div>
    );
}