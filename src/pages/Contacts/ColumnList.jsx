import React from "react";

export default function ColumnList(props) {
  const handleSelectOne = (e) => {
    e.stopPropagation();
    let value = e.target.value ? e.target.value : e.target.dataset.customValue;
    let id = e.target.id ? e.target.id : e.target.dataset.customId;
    const index = props.selected?.findIndex((item) => item.id == id);
    if (index >= 0) {
      props.setSelected(props.selected.filter((item) => item.id != id));
    } else {
      props.setSelected([...props.selected, { id: id, title: value }]);
    }
  };

  return (
    <span class="mintmrm-checkbox">
      <input
        type="checkbox"
        name={props.id}
        id={props.id}
        onChange={handleSelectOne}
        value={props.title}
        checked={props.selected?.findIndex((item) => item.id == props.id) >= 0}
      />
      <label for={props.id}>{props.title}</label>
    </span>
  );
}
