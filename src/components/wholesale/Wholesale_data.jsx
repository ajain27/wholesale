import { ReadOnlyCell, Badge } from "../elements";
import { Trash2, FileText } from "lucide-react";
import { currency } from "../../utils/utils";
import { useState, useEffect } from "react";
import Pagination from "../pagination/Pagination";
import Modal from "../modal/Modal";

function Wholesale_data({
  filteredDeals,
  deals,
  deleteDeal,
  persist,
  saveDeal,
}) {
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
    currentPage * itemsPerPage,
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

  async function updateDeal(id, field, value) {
    const deal = deals.find((d) => d.id === id);

    // Business Rule: Enforce the "Closed" requirements even on updates
    if (field === "closed" && value === "Yes") {
      const canClose = deal.sellerAccepted === "Yes" && deal.assigned === "Yes";

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

    const updatedDeal = nextDeals.find((deal) => deal.id === id);
    try {
      await saveDeal(updatedDeal);
      persist(nextDeals);
    } catch (error) {
      console.error("Failed to update property", error);
      alert("Unable to update property. Check your database connection.");
    }
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
              <th>Buyer Info</th>
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
                    style={{
                      background: "var(--input-bg)",
                      width: "100px",
                      padding: "0 12px",
                      border: "1px solid var(--input-border)",
                      color: "var(--input-text)",
                    }}
                    defaultValue={deal.contractPrice || ""}
                    disabled={deal.closed === "Yes"}
                    onBlur={(e) => {
                      const val = Number(e.target.value);
                      if (val > deal.arv && deal.arv > 0) {
                        alert(
                          `Contract price cannot be more than ARV (${currency(deal.arv)}).`,
                        );
                        e.target.value = deal.contractPrice || "";
                        return;
                      }
                      updateDeal(deal.id, "contractPrice", e.target.value);
                    }}
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
                      style={{
                        background: "var(--input-bg)",
                        width: "100px",
                        padding: "0 12px",
                        border: "1px solid var(--input-border)",
                        color: "var(--input-text)",
                      }}
                      defaultValue={deal.assignedPrice || ""}
                      disabled={deal.closed === "Yes"}
                      onBlur={(e) => {
                        const val = Number(e.target.value);
                        if (
                          val < deal.contractPrice &&
                          val > 0 &&
                          deal.contractPrice > 0
                        ) {
                          alert(
                            `Assigned price needs to be more than or equal to contract price (${currency(deal.contractPrice)}).`,
                          );
                          e.target.value = deal.assignedPrice || "";
                          return;
                        }
                        updateDeal(deal.id, "assignedPrice", e.target.value);
                      }}
                    />
                  ) : (
                    <span style={{ color: "#9ca3af" }}>—</span>
                  )}
                </td>
                <td>
                  {deal.assigned === "Yes" ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                        fontSize: "0.85em",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <strong>{deal.buyerName || "—"}</strong>
                      <span style={{ color: "var(--muted)" }}>
                        {deal.buyerEmail || ""}
                      </span>
                    </div>
                  ) : (
                    <span style={{ color: "#9ca3af" }}>—</span>
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
                    <strong style={{ color: "#059669" }}>
                      {currency(
                        Number(deal.assignedPrice || 0) -
                          Number(deal.contractPrice || 0),
                      )}
                    </strong>
                  ) : (
                    <span style={{ color: "#9ca3af" }}>—</span>
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

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      >
        <span>
          Showing {currentDeals.length} of {filteredDeals.length} results
        </span>
      </Pagination>

      <Modal
        isOpen={!!selectedDeal}
        onClose={() => setSelectedDeal(null)}
        title={`Notes for ${selectedDeal?.address}`}
        actions={
          <>
            <button
              className="secondary-btn"
              onClick={() => setSelectedDeal(null)}
            >
              Cancel
            </button>
            <button className="primary-btn" onClick={saveNotes}>
              Save Notes
            </button>
          </>
        }
      >
        <textarea
          value={notesDraft}
          onChange={(e) => setNotesDraft(e.target.value)}
          rows="6"
          placeholder="Add your notes here..."
        />
      </Modal>
    </>
  );
}

export default Wholesale_data;
