import { useState } from "react";
import Search from "../../components/Icons/Search";
import ColumnList from "./ColumnList";

export default function FilterItems(props) {
  return (
    <ul
      className={
        props.isActiveFilter ? "mintmrm-dropdown show" : "mintmrm-dropdown"
      }
    >
      <li className="searchbar">
        <span class="pos-relative">
          <Search />
          <input type="search" name="column-search" placeholder="Search..." />
        </span>
      </li>
      <li className="list-title">Choose List</li>
      <li className="single-column">
        <ColumnList title="Subscribe" name="subscribe" id="subscribe" />
      </li>
      <li className="single-column">
        <ColumnList title="Pending" name="pending" id="pending" />
      </li>
      <li className="single-column">
        <ColumnList title="Unsubscribe" name="unsubscribe" id="unsubscribe" />
      </li>
    </ul>
  );
}
