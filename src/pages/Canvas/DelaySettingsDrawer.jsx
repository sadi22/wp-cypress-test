import { useState } from "react";
import { useGlobalStore } from "../../hooks/useGlobalStore";
import "../../style/Canvas.css";

const DelaySettingsDrawer = (props) => {
  

  const today =  new Date().toISOString().split('T')[0];
  return (
    <>
        <input type="date" id="delayDate"
            min={today}></input>
        
        <input type="time" id="delayTime"
            min="09:00" max="18:00"></input>
    </>
  );
};

export default DelaySettingsDrawer;
