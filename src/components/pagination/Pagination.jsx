import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function Pagination({ currentPage, totalPages, setCurrentPage, children }) {
  const handlePrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  return (
    <div
      className="table-footer"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px",
      }}
    >
      <div>
        {children}
      </div>

      {totalPages > 1 && (
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button
            className="secondary-btn"
            disabled={currentPage === 1}
            onClick={handlePrev}
            style={{ padding: "6px 10px" }}
          >
            <ChevronLeft size={16} /> Prev
          </button>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              margin: "0 8px",
              color: "var(--muted)",
              fontSize: "14px", 
              fontWeight: "500"
            }}
          >
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="secondary-btn"
            disabled={currentPage === totalPages}
            onClick={handleNext}
            style={{ padding: "6px 10px" }}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

export default Pagination;
