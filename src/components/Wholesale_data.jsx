import { ReadOnlyCell, Badge } from "./elements";
import { Trash2, X, FileText } from "lucide-react";
import { currency } from "../utils/utils";
import { useState, useEffect } from "react";

function Wholesale_data({ filteredDeals, deals, deleteDeal, persist }) {
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [notesDraft, setNotesDraft] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredDeals]);

  const totalPages = Math.ceil(filteredDeals.length / itemsPerPage) || 1;
  const currentDeals = filteredDeals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleRowClick = (deal) => {
    setSelectedDeal(deal);
    setNotesDraft(deal.notes || "");
  };

  const saveNotes = () => {
    if (selectedDeal) {
      updateDeal(selectedDeal.id, "notes", notesDraft);
      setSelectedDeal(null);
    }
  };

  function updateDeal(id, field, value) {
    const deal = deals.find((d) => d.id === id);

    if (["contractPrice", "assignedPrice"].includes(field)) {
      const numValue = Number(value);
      if (!isNaN(numValue) && numValue > deal.arv) {
        alert(`${field === "contractPrice" ? "Contract" : "Assigned"} Price cannot be more than ARV (${currency(deal.arv)}).`);
        return;
      }
    }

    // Business Rule: Enforce the "Closed" requirements even on updates
    if (field === "closed" && value === "Yes") {
      const deal = deals.find((d) => d.id === id);
      const canClose =
        deal.sellerAccepted === "Yes" &&
        deal.assigned === "Yes";

      if (!canClose) {
        alert(
          "Cannot Close: Offer must be 'Accepted', and 'Assigned' must be 'Yes'.",
        );
        return;
      }
    }

    const nextDeals = deals.map((deal) =>
      deal.id === id ? { ...deal, [field]: value } : deal,
    );

    persist(nextDeals);
  }

  return (
    <>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th style={{ width: "60px", textAlign: "center" }}>Notes</th>
              <th>Property Address</th>
              <th>City</th>
              <th>Zip Code</th>
              <th>State</th>
              <th>ARV</th>
              <th>Rehab Cost</th>
              <th>MAO</th>
              <th>Offer Status</th>
              <th>Offer Date</th>
              <th>Accepted</th>
              <th>Contract Price</th>
              <th>Assigned</th>
              <th>Assigned Price</th>
              <th>Closed</th>
              <th>Gross Revenue</th>
            </tr>
          </thead>
          <tbody>
            {currentDeals.map((deal) => (
              <tr key={deal.id}>
                <td style={{ textAlign: "center" }}>
                  <button
                    className="secondary-btn"
                    onClick={() => handleRowClick(deal)}
                    style={{ padding: "6px 8px", minWidth: "auto" }}
                    title="View/Edit Notes"
                  >
                    <FileText size={16} />
                  </button>
                </td>
                <ReadOnlyCell value={deal.address} wide />
                <ReadOnlyCell value={deal.city} />
                <ReadOnlyCell value={deal.zipCode} />
                <ReadOnlyCell value={deal.state} small />
                <ReadOnlyCell value={currency(deal.arv)} />
                <ReadOnlyCell value={currency(deal.rehabCost)} />
                <ReadOnlyCell value={currency(deal.mao)} />
                <td>
                  <select
                    className={`badge ${deal.offerStatus?.toLowerCase()?.replaceAll(" ", "-")}`}
                    value={deal.offerStatus}
                    disabled={deal.closed === "Yes"}
                    onChange={(e) =>
                      updateDeal(deal.id, "offerStatus", e.target.value)
                    }
                  >
                    <option value="Not Sent">Not Sent</option>
                    <option value="Offer Sent">Offer Sent</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Closed">Closed</option>
                  </select>
                </td>
                <ReadOnlyCell
                  value={
                    deal.offerDate
                      ? new Date(
                          `${deal.offerDate}T00:00:00`,
                        ).toLocaleDateString()
                      : "—"
                  }
                />
                <td>
                  <Badge value={deal.sellerAccepted} />
                </td>
                <td>
                  <input
                    type="number"
                    className="readonly-input small"
                    style={{ background: 'var(--input-bg)', width: '100px', padding: '0 12px', border: '1px solid var(--input-border)', color: 'var(--input-text)' }}
                    value={deal.contractPrice || ""}
                    disabled={deal.closed === "Yes"}
                    onChange={(e) => updateDeal(deal.id, "contractPrice", e.target.value)}
                  />
                </td>
                <td>
                  <select
                    className={`badge ${deal.assigned?.toLowerCase()}`}
                    value={deal.assigned}
                    disabled={deal.closed === "Yes"}
                    onChange={(e) =>
                      updateDeal(deal.id, "assigned", e.target.value)
                    }
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </td>
                <td>
                  {deal.assigned === "Yes" ? (
                    <input
                      type="number"
                      className="readonly-input small"
                      style={{ background: 'var(--input-bg)', width: '100px', padding: '0 12px', border: '1px solid var(--input-border)', color: 'var(--input-text)' }}
                      value={deal.assignedPrice || ""}
                      disabled={deal.closed === "Yes"}
                      onChange={(e) =>
                        updateDeal(deal.id, "assignedPrice", e.target.value)
                      }
                    />
                  ) : (
                    <span style={{ color: '#9ca3af' }}>—</span>
                  )}
                </td>
                <td>
                  <select
                    className={`badge ${deal.closed?.toLowerCase()}`}
                    value={deal.closed}
                    disabled={deal.closed === "Yes"}
                    onChange={(e) =>
                      updateDeal(deal.id, "closed", e.target.value)
                    }
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </td>
                <td>
                  {deal.closed === "Yes" ? (
                    <strong style={{ color: '#059669' }}>
                      {currency(Number(deal.assignedPrice || 0) - Number(deal.contractPrice || 0))}
                    </strong>
                  ) : (
                    <span style={{ color: '#9ca3af' }}>—</span>
                  )}
                </td>
                <td>
                  <button
                    className="danger-btn"
                    title="Delete"
                    onClick={() => deleteDeal(deal.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-footer" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px" }}>
        <span>Showing {currentDeals.length} of {filteredDeals.length} results</span>
        <div style={{ display: "flex", gap: "8px" }}>
          <button 
            className="secondary-btn" 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          >
            Previous
          </button>
          <span style={{ display: "flex", alignItems: "center", margin: "0 8px", color: "var(--muted)" }}>
            Page {currentPage} of {totalPages}
          </span>
          <button 
            className="secondary-btn" 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          >
            Next
          </button>
        </div>
      </div>

      {selectedDeal && (
        <div className="modal-overlay" onClick={() => setSelectedDeal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h2 style={{ marginBottom: 0 }}>Notes for {selectedDeal.address}</h2>
              <button className="danger-btn" onClick={() => setSelectedDeal(null)} style={{ background: "transparent", color: "var(--muted)", padding: "4px" }}>
                <X size={20} />
              </button>
            </div>
            <textarea
              value={notesDraft}
              onChange={(e) => setNotesDraft(e.target.value)}
              rows="6"
              placeholder="Add your notes here..."
            />
            <div className="modal-actions">
              <button className="secondary-btn" onClick={() => setSelectedDeal(null)}>
                Cancel
              </button>
              <button className="primary-btn" onClick={saveNotes}>
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Wholesale_data;
