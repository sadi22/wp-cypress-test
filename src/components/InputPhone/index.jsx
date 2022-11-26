import "./style.css";

export default function InoutPhone(props) {
  return (
    <div className="form-group contact-input-field">
      <label htmlFor="" aria-required>
        {props.label}
        {props.isRequired ? <span>*</span> : null}
      </label>
      <input
        type="text"
        name={props.name}
        onChange={props.handleChange}
        placeholder={props.placeholder}
        defaultValue={props.value}
      />
      <p className={props?.error ? "error-message show" : "error-message"}>
        {props?.error}
      </p>
    </div>
  );
}
