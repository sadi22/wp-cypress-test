export default function OptionList(props) {
  const {selected, setSelected, allowMultiple = true } = props;


  const handleSelectOne = (e) => {
    e.stopPropagation();
    let value = e.target.value ? e.target.value : e.target.dataset.customValue;
    let id = e.target.id ? e.target.id : e.target.dataset.customId;
    const index = selected.findIndex((item) => item.id == id);

    // already in selected list so remove it from the array
    if (allowMultiple) {
      if (index >= 0) {
        setSelected(selected.filter((item) => item.id != id));
      } else {
        // add id to the array
        setSelected([...selected, { id: id, title: value }]);
      }
    } else {
      if (index >= 0) setSelected([]);
      else setSelected([{ id: id, title: value }]);
    }
  };

  
  return (
    <div class="mintmrm-checkbox">
      <input
        type="checkbox"
        name={props.id}
        id={props.id}
        value={props.title}
        onChange={handleSelectOne}
        checked={props.checked}
        
        
      />

      <label for={props.id} className="mrm-custom-select-label">
        {props.title}
      </label>
    </div>
  );
}
