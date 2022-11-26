import { useState, useEffect } from "react";
import { useGlobalStore } from "../../hooks/useGlobalStore";
import "../../style/Canvas.css";




const TriggerSettingsDrawer = (props) => {
  const triggerStep = useGlobalStore((state) => state.triggerStep);

  //change it to dynamic
  const id = 1;

  const test = () =>{
    useGlobalStore.setState({
      triggerStep : {
        triggerCondition : triggerStep.triggerCondition,
        triggerOption : {
        }
      }
    })
  }

  //TO DO: All trigger data in a variable from rest API

  return (
    <>
        <label>Condition to Trigger:</label>
            <select 
            id="triggerCondition"
            onChange={(e) => useGlobalStore.setState({
              triggerStep : {
                triggerCondition: e.target.value
              }
            })}
            > 
            <option value="true">True</option>
            <option value="false">False</option>
        </select>
        <div>
          <button onClick={test}>Test</button>
        </div>
    </>
  );
};

export default TriggerSettingsDrawer;
