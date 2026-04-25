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
              <th>Assigned</th>
              <th>Closed</th>
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
                  <Badge value={deal.offerStatus} />
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
                  <Badge value={deal.assigned} />
                </td>
                <td>
                  <select
                    className={`badge ${deal.closed.toLowerCase()}`}
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
