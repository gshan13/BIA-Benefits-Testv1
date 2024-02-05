import React from "react";

function PaginationLayout({ currentPage, totalPages, nextPage, prevPage }) {
  return (
    <div className="pagination-container flex justify-center">
      <button
        className="join-item btn mt-2"
        onClick={prevPage}
        disabled={currentPage === 1}
      >
        «
      </button>
      <button className="join-item btn mt-2">Page {currentPage}</button>
      <button
        className="join-item btn mt-2"
        onClick={nextPage}
        disabled={currentPage === totalPages}
      >
        »
      </button>
    </div>
  );
}

export default PaginationLayout;
