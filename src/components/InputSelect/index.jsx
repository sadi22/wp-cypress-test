import "./style.css";

export default function InputSelect(props) {
  console.log(props);
  return (
    <div className="form-group contact-input-field">
      <div key={`mrm-${props.name}`} className="mrm-form-group select">
        <label htmlFor={props.label}>
          {props.label}
          {props.required && <span className="required-mark">*</span>}
        </label>

        <div className="input-wrapper">
          <select
            name={props.name}
            id={props.name}
            onChange={props.handleChange}
          >
            {props.selectOption.map((option, index) => {
              return (
                <option key={index} value={option} >
                  {option}
                </option>
              );
            })}
          </select>
        </div>
      </div>
    </div>
  );
}
