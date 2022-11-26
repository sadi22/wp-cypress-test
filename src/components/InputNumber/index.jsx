import "./style.css";

export default function InputNumber( props ) {
  return (
    <div className="form-group contact-input-field">
      <label htmlFor="" aria-required>
        {props.label}
        {props.isRequired ? <span>*</span> : null}
      </label>
      <input type="number" name={props.name} onChange={ props.handleChange } placeholder={props.placeholder} defaultValue={props.value} />
        <p>{props?.error}</p>

    </div>
  );
}
