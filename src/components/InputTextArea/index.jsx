import "./style.css";

export default function InputItem(props) {
  return (
    <div className="form-group contact-input-field">
      <label htmlFor="" aria-required>
        {props.label}
        {props.isRequired ? <span>*</span> : null}
      </label>
      <textarea
        rows="4"
        type={props.type ? props.type : "text-area"}
        name={props.name}
        onChange={props.handleChange}
        defaultValue={props.value}
        placeholder={props.placeholder}
      ></textarea>

      <p className={props?.error ? "error-message show" : "error-message"}>
        {props?.error}
      </p>
    </div>
  );
}
