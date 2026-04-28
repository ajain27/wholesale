import { useState } from "react";
import { ReadOnlyCell } from "../elements";
import { Trash2, Edit2, Check } from "lucide-react";
import Pagination from "../pagination/Pagination";

function BuyerData({ filteredBuyers, buyers, deleteBuyer, updateBuyer }) {
  const [editingBuyerId, setEditingBuyerId] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [editFieldValue, setEditFieldValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredBuyers.length / itemsPerPage) || 1;
  const safePage = Math.min(currentPage, totalPages);

  const startIndex = (safePage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredBuyers.length);
  const paginatedBuyers = filteredBuyers.slice(startIndex, endIndex);

  function startEditingField(buyer, field) {
    setEditingBuyerId(buyer.id);
    setEditingField(field);
    setEditFieldValue(buyer[field] || "");
  }

  function saveField(id) {
    if (!editingField) return;
    updateBuyer(id, editingField, editFieldValue);
    setEditingBuyerId(null);
    setEditingField(null);
    setEditFieldValue("");
  }

  return (
    <>
      <div className="table-wrap">
        <table className="compact-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>State</th>
              <th>City</th>
              <th>Phone Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedBuyers.map((buyer) => (
              <tr key={buyer.id}>
                <ReadOnlyCell value={buyer.fullName} wide />
                <td>
                  {editingBuyerId === buyer.id && editingField === "email" ? (
                    <div
                      style={{
                        display: "flex",
                        gap: "6px",
                        alignItems: "center",
                      }}
                    >
                      <input
                        id={`edit-email-${buyer.id}`}
                        style={{
                          width: "220px",
                          height: "36px",
                          padding: "0 8px",
                          border: "1px solid var(--blue)",
                          borderRadius: "6px",
                          outline: "none",
                        }}
                        value={editFieldValue}
                        onChange={(e) => setEditFieldValue(e.target.value)}
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveField(buyer.id);
                          if (e.key === "Escape") {
                            setEditingBuyerId(null);
                            setEditingField(null);
                          }
                        }}
                      />
                      <button
                        className="ghost-btn"
                        onClick={() => saveField(buyer.id)}
                        style={{
                          width: "32px",
                          height: "32px",
                          minWidth: "32px",
                          padding: 0,
                        }}
                        title="Save"
                      >
                        <Check size={16} color="var(--green)" />
                      </button>
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        gap: "6px",
                        alignItems: "center",
                      }}
                    >
                      <input
                        id={`readonly-email-${buyer.id}`}
                        className="readonly-input extra-wide"
                        readOnly
                        value={buyer.email || ""}
                      />
                      <button
                        className="ghost-btn"
                        onClick={() => startEditingField(buyer, "email")}
                        style={{
                          width: "32px",
                          height: "32px",
                          minWidth: "32px",
                          padding: 0,
                          border: "none",
                          background: "transparent",
                        }}
                        title="Edit Email"
                      >
                        <Edit2 size={16} color="var(--muted)" />
                      </button>
                    </div>
                  )}
                </td>
                <ReadOnlyCell value={buyer.state} small />
                <ReadOnlyCell value={buyer.city} />
                <td>
                  {editingBuyerId === buyer.id && editingField === "phone" ? (
                    <div
                      style={{
                        display: "flex",
                        gap: "6px",
                        alignItems: "center",
                      }}
                    >
                      <input
                        id={`edit-phone-${buyer.id}`}
                        style={{
                          width: "180px",
                          height: "36px",
                          padding: "0 8px",
                          border: "1px solid var(--blue)",
                          borderRadius: "6px",
                          outline: "none",
                        }}
                        value={editFieldValue}
                        onChange={(e) => setEditFieldValue(e.target.value)}
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveField(buyer.id);
                          if (e.key === "Escape") {
                            setEditingBuyerId(null);
                            setEditingField(null);
                          }
                        }}
                      />
                      <button
                        className="ghost-btn"
                        onClick={() => saveField(buyer.id)}
                        style={{
                          width: "32px",
                          height: "32px",
                          minWidth: "32px",
                          padding: 0,
                        }}
                        title="Save"
                      >
                        <Check size={16} color="var(--green)" />
                      </button>
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        gap: "6px",
                        alignItems: "center",
                      }}
                    >
                      <input
                        id={`readonly-phone-${buyer.id}`}
                        className="readonly-input"
                        readOnly
                        value={buyer.phone || ""}
                      />
                      <button
                        className="ghost-btn"
                        onClick={() => startEditingField(buyer, "phone")}
                        style={{
                          width: "32px",
                          height: "32px",
                          minWidth: "32px",
                          padding: 0,
                          border: "none",
                          background: "transparent",
                        }}
                        title="Edit Phone"
                      >
                        <Edit2 size={16} color="var(--muted)" />
                      </button>
                    </div>
                  )}
                </td>
                <td>
                  <button
                    className="danger-btn"
                    title="Delete"
                    onClick={() => deleteBuyer(buyer.id)}
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
        currentPage={safePage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      >
        <div>
          Showing {filteredBuyers.length > 0 ? startIndex + 1 : 0} to {endIndex}{" "}
          of {filteredBuyers.length} results (Total Buyers: {buyers.length})
        </div>
      </Pagination>
    </>
  );
}

export default BuyerData;
