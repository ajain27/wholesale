import { Search } from "lucide-react";
import { Select } from "./elements";

function Wholesale_filters({
  filters,
  states,
  zipCodes,
  RefreshCw,
  setFilters,
}) {
  return (
    <div>
      <section className="panel board-panel">
        <div className="filters">
          <Select
            label="State"
            value={filters.state}
            onChange={(e) =>
              setFilters({
                ...filters,
                state: e.target.value,
                zipCode: "All",
              })
            }
            options={states}
          />
          <Select
            label="Zip Code"
            value={filters.zipCode}
            onChange={(e) =>
              setFilters({ ...filters, zipCode: e.target.value })
            }
            options={zipCodes}
          />
          <Select
            label="Offer Status"
            value={filters.offerStatus}
            onChange={(e) =>
              setFilters({ ...filters, offerStatus: e.target.value })
            }
            options={[
              "All",
              "Not Sent",
              "Offer Sent",
              "Under Review",
              "Rejected",
              "Accepted",
              "Closed",
            ]}
          />
          <Select
            label="Accepted"
            value={filters.sellerAccepted}
            onChange={(e) =>
              setFilters({ ...filters, sellerAccepted: e.target.value })
            }
            options={["All", "No", "Maybe", "Yes"]}
          />
          <Select
            label="Assigned"
            value={filters.assigned}
            onChange={(e) =>
              setFilters({ ...filters, assigned: e.target.value })
            }
            options={["All", "No", "Yes"]}
          />
          <button
            className="secondary-btn"
            onClick={() =>
              setFilters({
                state: "All",
                zipCode: "All",
                offerStatus: "All",
                sellerAccepted: "All",
                assigned: "All",
                search: "",
                closed: "All",
              })
            }
          >
            <RefreshCw size={16} /> Clear Filters
          </button>
          <label className="search-field">
            <Search size={18} />
            <input
              value={filters.search}
              id="search"
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              placeholder="Search by address, city, or zip code..."
            />
          </label>
        </div>
      </section>
    </div>
  );
}

export default Wholesale_filters;
