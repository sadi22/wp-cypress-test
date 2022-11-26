import React from "react";

export default function ColumnItems(props) {
  return (
    <span class="mintmrm-checkbox">
      <input type="checkbox" name={props.name} id={props.id} onChange={props.handleSelectOne} checked={props.selected.includes(props.id)} />
      <label for={props.id}>{props.title}</label>
    </span>
  );
}