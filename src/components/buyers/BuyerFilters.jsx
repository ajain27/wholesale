import { Search, RefreshCw } from "lucide-react";
import { Select } from "../elements";

function BuyerFilters({ filters, states, setFilters }) {
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
      </div>
      <div className="filters">
        <label className="search-field">
          <Search size={18} />
          <input
            id="buyer-search"
            type="text"
            name="search"
            placeholder="Search buyers by name, email, phone, city..."
            value={filters.search}
            onChange={handleFilter}
          />
        </label>
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
