import { useState } from "react";
import { Handle, Position } from "react-flow-renderer";
import { useGlobalStore } from "../../hooks/useGlobalStore";
import "../../style/Canvas.css";
import CanvasStepOptions from "./CanvasStepOptions";

const ExitStep = (props) => {
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
        <div className="canvas-step-title">Exit Step</div>
        <div>Exit</div>
      </div>
      <Handle type="target" position={Position.Left} className="handle-left" />
    </>
  );
};

export default ExitStep;
