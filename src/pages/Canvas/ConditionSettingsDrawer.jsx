import { useState } from "react";
import { useGlobalStore } from "../../hooks/useGlobalStore";
import "../../style/Canvas.css";

const ConditionSettingsDrawer = (props) => {
  const {
    openSettingsDrawer,
    setOpenSettingsDrawer,
    selectedNodeID,
    selectedNodeType,
  } = props;

  return (
    <>
        <label>Condition :</label>
            <select id="ifElseCondition">
            <option value="if">True</option>
            <option value="else">False</option>
        </select>
    </>
  );
};

export default ConditionSettingsDrawer;
