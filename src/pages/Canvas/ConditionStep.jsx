import { Handle, Position } from "react-flow-renderer";
import "../../style/Canvas.css";
import CanvasStepOptions from "./CanvasStepOptions";

const ConditionStep = (props) => {
  const { id, type } = props;
  return (
    <>
      <Handle type="target" position={Position.Left} className="handle-left" />
      <div className="canvas-step-wrapper">
        <CanvasStepOptions
          data={props.data}
          showEdit={false}
          id={id}
          type={type}
        />
        <div className="canvas-step-title">Condition Step</div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="handle-right"
        style={{ top: "10px" }}
        id="if"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="handle-right"
        style={{ bottom: "10px", top: "auto" }}
        id="else"
      />
    </>
  );
};

export default ConditionStep;
