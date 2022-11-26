// External dependencies
import React from "react";
import classnames from "classnames";

// Internal dependencies
import DoubleAngleLeftIcon from "../Icons/DoubleAngleLeftIcon";
import DoubleAngleRightIcon from "../Icons/DoubleAngleRightIcon";
import { usePagination, DOTS } from "./usePagination";

const Pagination = (props) => {
  const {
    onPageChange,
    totalCount,
    siblingCount = 1,
    currentPage,
    pageSize,
    totalPages,
  } = props;
  
  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  // If there are less than 2 times in pagination range we shall not render the component
  

  const onNext = () => {
    onPageChange(Math.min(totalPages, currentPage + 1), pageSize, "");
  };

  const onPrevious = () => {
    onPageChange(Math.max(1, currentPage - 1), pageSize, "");
  };

  // let lastPage = paginationRange[paginationRange.length - 1];

  return (
    <>
      <div className="contact-list-footer">
        <div className="footer-show-number">
          {currentPage <= totalPages && (
            <>
              <p className="showing">Showing</p>
              {/* <input type="number" value={perPage} onChange={setPerPage} /> */}
              <p className="single-page-data">{`${Math.max(
                1,
                (currentPage - 1) * pageSize + 1
              )}-${Math.min(
                totalCount,
                (currentPage - 1) * pageSize + pageSize
              )} of ${totalCount} items`}</p>
            </>
          )}
        </div>

        {totalCount > 0 && (
        <ul className="footer-pagination">
        {/* Left navigation arrow */}
        <li href="#" onClick={onPrevious}>
          <DoubleAngleLeftIcon />
        </li>

        {paginationRange?.map((pageNumber, key) => {
          // If the pageItem is a DOT, render the DOTS unicode character
          if (pageNumber === DOTS) {
            return (
              <li key={key} className="pagination-item dots">
                &#8230;
              </li>
            );
          }

          // Render our Page Pills
          return (
            <li
              key={key}
              className={classnames("pagination-item", {
                active: pageNumber === currentPage,
              })}
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber}
            </li>
          );
        })}

        {/* Right navigation arrow */}
        <li onClick={onNext}>
          <DoubleAngleRightIcon />
        </li>
      </ul>
        )}
      </div>
    </>
  );
};

export default Pagination;
