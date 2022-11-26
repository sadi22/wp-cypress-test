import "./style.css";

export default function InputDate(props) {
  const today = new Date().toISOString().split("T")[0];
  return (
    <div className="form-group contact-input-field date_field">
      <label htmlFor="" aria-required>
        {props.label}
        {props.isRequired ? <span>*</span> : null}
      </label>
      <input
        type="date"
        name={props.name}
        onChange={props.handleChange}
        defaultValue={props.value}
        max={today}
        onKeyPress="return disablekeys();"
      />
      <p>{props?.error}</p>
    </div>
  );
}
