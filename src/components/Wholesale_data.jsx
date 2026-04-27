import { ReadOnlyCell, Badge } from "./elements";
import { Trash2 } from "lucide-react";
import { currency } from "../utils/utils";

function Wholesale_data({ filteredDeals, deals, deleteDeal, persist }) {
  function updateDeal(id, field, value) {
    // Business Rule: Enforce the "Closed" requirements even on updates
    if (field === "closed" && value === "Yes") {
      const deal = deals.find((d) => d.id === id);
      const canClose =
        deal.offerStatus === "Accepted" &&
        deal.sellerAccepted === "Yes" &&
        deal.assigned === "Yes";

      if (!canClose) {
        alert(
          "Cannot Close: Offer must be 'Accepted',and 'Assigned' must be 'Yes'.",
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
            {filteredDeals.map((deal) => (
              <tr key={deal.id}>
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
                    style={{ background: '#fff', width: '100px' }}
                    value={deal.contractPrice || ""}
                    onChange={(e) => updateDeal(deal.id, "contractPrice", e.target.value)}
                  />
                </td>
                <td>
                  <select
                    className={`badge ${deal.assigned?.toLowerCase()}`}
                    value={deal.assigned}
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
                      style={{ background: '#fff', width: '100px' }}
                      value={deal.assignedPrice || ""}
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

      <div className="table-footer">
        Showing {filteredDeals.length} of {deals.length} results
      </div>
    </>
  );
}

export default Wholesale_data;
