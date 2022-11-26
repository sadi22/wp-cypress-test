import { useState } from "react";
import { Handle, Position } from "react-flow-renderer";
import { useGlobalStore } from "../../hooks/useGlobalStore";
import "../../style/Canvas.css";
import CanvasStepOptions from "./CanvasStepOptions";

const SendEmailStep = (props) => {
  const [selection, setSelection] = useState([]);

  const { id, type } = props;
  return (
    <>
      <div className="canvas-step-wrapper">
        <CanvasStepOptions
          data={props.data}
          showEdit={false}
          id={id}
          type={type}
        />
        <div className="canvas-step-title">Send Email</div>
        <div>Send Email</div>
      </div>
      <Handle type="target" position={Position.Left} className="handle-left" />
      <Handle type="source" position={Position.Right} className="handle-right" />
    </>
  );
};

export default SendEmailStep;
