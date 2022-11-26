import { useEffect, useState } from "react";
import "../../style/Canvas.css";
const CanvasStepOptions = ({
  showEdit = true,
  showSettings = true,
  showDeleteNode = true,
  showDeleteEdge = true,
  showReset = true,
  data,
  id,
  type,
}) => {
  const { openSettings, deleteEdges, deleteNode, resetNode } = data;

  return (
    <div className="canvas-step-options-wrapper">
      {showSettings && (
        <div
          className="canvas-step-option"
          onClick={() => {
            openSettings(id, type);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="canvas-step-icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
      )}
      {showEdit && (
        <div
          className="canvas-step-option"
          onClick={() => {
            // edit(id);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="canvas-step-icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </div>
      )}
      {showReset && (
        <div
          className="canvas-step-option"
          onClick={() => {
            resetNode(id);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="canvas-step-icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </div>
      )}
      {showDeleteEdge && (
        <div
          className="canvas-step-option"
          onClick={() => {
            deleteEdges(id);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="canvas-step-icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z"
            />
          </svg>
        </div>
      )}
      {showDeleteNode && (
        <div
          className="canvas-step-option"
          onClick={() => {
            deleteNode(id);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="canvas-step-icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
      )}
    </div>
  );
};

export default CanvasStepOptions;
