import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function Pagination({ currentPage, totalPages, setCurrentPage, children }) {
  const handlePrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  return (
    <div className="table-footer pagination-footer">
      <div>{children}</div>

      {totalPages > 1 && (
        <div className="pagination-actions">
          <button
            className="secondary-btn pagination-button"
            disabled={currentPage === 1}
            onClick={handlePrev}
          >
            <ChevronLeft size={16} /> Prev
          </button>
          <span className="pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="secondary-btn pagination-button"
            disabled={currentPage === totalPages}
            onClick={handleNext}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

export default Pagination;
