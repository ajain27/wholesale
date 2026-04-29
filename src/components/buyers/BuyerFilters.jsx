import { Search, RefreshCw } from "lucide-react";
import { Select } from "../elements";
import { useState } from "react";

function BuyerFilters({ filters, states, setFilters }) {
  const [searchExpanded, setSearchExpanded] = useState(false);

  const handleFilter = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      state: "All",
      search: "",
    });
  };

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2>Filter Buyer</h2>
        </div>
        <div className="search-container">
          <button
            type="button"
            className="search-icon-btn"
            onClick={() => setSearchExpanded(!searchExpanded)}
            title="Search"
          >
            <Search size={18} />
          </button>
          {searchExpanded && (
            <input
              autoFocus
              type="text"
              className="search-input-expanded"
              id="buyer-search"
              name="search"
              placeholder="Search buyers by name, email, phone, city..."
              value={filters.search}
              onChange={handleFilter}
              onBlur={() => {
                if (!filters.search) {
                  setSearchExpanded(false);
                }
              }}
            />
          )}
        </div>
      </div>
      <div className="filters">
        <Select
          label="Filter by State"
          name="state"
          value={filters.state}
          onChange={handleFilter}
          options={states}
        />
        <button className="secondary-btn" onClick={clearFilters}>
          <RefreshCw size={16} /> Clear Filters
        </button>
      </div>
    </section>
  );
}

export default BuyerFilters;
