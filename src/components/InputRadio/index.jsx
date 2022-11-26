import "./style.css";

export default function InputRadio(props) {
  return (
    <div className="form-group contact-input-field">
      <div key={`mrm-${props.name}`} className="mrm-form-group radio">
        <label htmlFor={props.label}>
          {props.label}
          {props.required && <span className="required-mark">*</span>}
        </label>
        {props.selectOption.map((option, index) => {
          return (
            <div className="mrm-radio-group mintmrm-radiobtn">
            <input
                key={index}
                type="radio"
                id={option}
                name={props.name}
                onChange={props.handleChange}
                value={option}
                checked={option === props.selectedValue}
              />
              <label htmlFor={option} >
                {option}
                {props.required && <span className="required-mark">*</span>}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
