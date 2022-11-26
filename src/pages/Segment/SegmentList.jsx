import HoverMenu from "../../components/HoverMenu";
import Portal from "../../components/Portal";
import { useState, useEffect, useRef } from "react";
import ThreeDotIcon from "../../components/Icons/ThreeDotIcon";
import EditIcon from "../../components/Icons/EditIcon";
import Delete from "../../components/Icons/Delete";
import ListenForOutsideClicks from "../../components/ListenForOutsideClicks";

export default function SegmentList(props) {
  const {
    segment,
    selected,
    deleteSegment,
    currentActive,
    setCurrentActive,
    handleSelectOne,
  } = props;

  const { title, created_at, total_contacts, id, description } = segment;
  const [isActiveDropdown, setIsActiveDropdown] = useState(false);
  const [listening, setListening] = useState(false);

  const menuButtonRef = useRef(null);
  const moreOptionRef = useRef(null);

  useEffect(
    ListenForOutsideClicks(
      listening,
      setListening,
      moreOptionRef,
      setIsActiveDropdown
    )
  );

  return (
    <tr>
      <td>
        <span class="mintmrm-checkbox" title="">
          <input
            type="checkbox"
            name={id}
            id={id}
            onChange={handleSelectOne}
            checked={selected.includes(id)}
          />
          <label for={id}>{title}</label>
        </span>
      </td>
      <td className="">
        {description?.length > 30
          ? description.substring(0, 30) + "..."
          : description}
      </td>
      <td className="">{total_contacts}</td>
      <td className="">{new Date(created_at).toDateString()}</td>
      <td ref={moreOptionRef}>
        <button
          className="more-option"
          onClick={() => {
            setIsActiveDropdown((prev) => !prev);
          }}
          ref={menuButtonRef} // we need to add ref to menu button in order to correctly position the hovermenu
        >
          <ThreeDotIcon />
          {isActiveDropdown && ( // only show the menu if both active and current active points to this listitem
            <Portal>
              <HoverMenu elementRef={menuButtonRef} x={-10} y={-20}>
                <ul
                  style={{ width: "190px" }}
                  className={
                    isActiveDropdown // only show the menu  current active points to this listitem id
                      ? "mintmrm-dropdown show"
                      : "mintmrm-dropdown"
                  }
                >
                  <li>
                    <EditIcon />
                    Edit
                  </li>
                  <li onClick={() => deleteSegment(id)}>
                    <Delete />
                    Delete
                  </li>
                </ul>
              </HoverMenu>
            </Portal>
          )}
        </button>
      </td>
    </tr>
  );
}
