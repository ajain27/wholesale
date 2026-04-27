import { ReadOnlyCell } from "./elements";
import { Trash2 } from "lucide-react";

function BuyerData({ filteredBuyers, buyers, deleteBuyer, persist }) {
  function updateBuyer(id, field, value) {
    const nextBuyers = buyers.map((buyer) =>
      buyer.id === id ? { ...buyer, [field]: value } : buyer,
    );
    persist(nextBuyers);
  }

  return (
    <>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>City</th>
              <th>State</th>
              <th>Type of Real Estate</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBuyers.map((buyer) => (
              <tr key={buyer.id}>
                <ReadOnlyCell value={buyer.fullName} />
                <a href={buyer.email ? `mailto:${buyer.email}` : "#"}>
                  <ReadOnlyCell value={buyer.email} />
                </a>
                <a href={buyer.phone ? `tel:${buyer.phone}` : "#"}>
                  <ReadOnlyCell value={buyer.phone} />
                </a>
                <ReadOnlyCell value={buyer.city} />
                <ReadOnlyCell value={buyer.state} small />
                <td>
                  <select
                    className="badge"
                    value={buyer.realEstateType}
                    onChange={(e) =>
                      updateBuyer(buyer.id, "realEstateType", e.target.value)
                    }
                  >
                    <option value="Single Family">Single Family</option>
                    <option value="Multi Family">Multi Family</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Land">Land</option>
                    <option value="Other">Other</option>
                  </select>
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

      <div className="table-footer">
        Showing {filteredBuyers.length} of {buyers.length} results
      </div>
    </>
  );
}

export default BuyerData;
