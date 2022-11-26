import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Delete from "../Icons/Delete";
import Plus from "../Icons/Plus";
import "./style.css";

function DynamicInput(props) {
  const { id } = useParams();
  const [serviceList, setServiceList] = useState([{ option: "" }]);

  useEffect(() => {
    if (id) {
      if (undefined == props.options.options) {
        props.options.options?.setServiceList(props.options.options);
      } else {
        setServiceList(props.options.options);
      }
    }
  }, [id]);

  const handleServiceChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...serviceList];
    list[index][name] = value;
    setServiceList(list);
    props.onOptionData(list);
  };

  const handleServiceRemove = (index) => {
    const list = [...serviceList];
    list.splice(index, 1);
    setServiceList(list);
    props.onOptionData(list);
  };

  const handleServiceAdd = () => {
    setServiceList([...serviceList, { option: "" }]);
  };

  return (
    <div className="form-group contact-input-field">
      <label htmlFor="option">Option(s)</label>
      {serviceList.map((singleService, index) => (
        <div key={index} className="services">
          <div className="first-division">
            <input
              name="option"
              type="text"
              id="option"
              value={singleService.option}
              onChange={(e) => handleServiceChange(e, index)}
            />
            {serviceList.length !== 1 && (
              <button
                type="button"
                onClick={() => handleServiceRemove(index)}
                className="remove-btn"
              >
                <Delete />
              </button>
            )}
          </div>
          {serviceList.length - 1 === index && serviceList.length < 6 && (
            <button
              className="add-contact-btn mintmrm-btn add-option-btn"
              onClick={handleServiceAdd}
            >
              <Plus /> Add option
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default DynamicInput;
