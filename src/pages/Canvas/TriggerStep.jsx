import { useState } from "react";
import { Handle, Position } from "react-flow-renderer";
import { useGlobalStore } from "../../hooks/useGlobalStore";
import "../../style/Canvas.css";
import CanvasStepOptions from "./CanvasStepOptions";

const LandingStep = (props) => {
  const [selection, setSelection] = useState([]);

  const { id, type } = props;
  return (
    <>
      <div className="canvas-step-wrapper">
        <CanvasStepOptions
          data={props.data}
          showEdit={false}
          showDeleteNode={false}
          id={id}
          type={type}
        />

        <div className="canvas-step-title">Trigger Step</div>
        <div>Trigger</div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="handle-right"
      />
    </>
  );
};

export default LandingStep;
