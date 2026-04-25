import { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  CheckCircle2,
  ClipboardList,
  Home,
  Plus,
  RefreshCw,
  Search,
  Send,
} from "lucide-react";
import "./styles.css";
import { getSavedDeals, currency, monthKey } from "./utils";
import Wholesale_form from "./wholesale_form";
import { Select, Stat } from "./elements";
import Wholesale_data from "./Wholesale_data";

const emptyForm = {
  address: "",
  city: "",
  zipCode: "",
  state: "",
  arv: "",
  rehabCost: "",
  mao: "",
  offerStatus: "Not Sent",
  offerDate: "",
  sellerAccepted: "No",
  assigned: "No",
  notes: "",
  closed: "No",
};

function App() {
  const [deals, setDeals] = useState(getSavedDeals);
  const [form, setForm] = useState(emptyForm);
  const [filters, setFilters] = useState({
    state: "All",
    zipCode: "All",
    offerStatus: "All",
    sellerAccepted: "All",
    assigned: "All",
    search: "",
    closed: "All",
  });

  const STORAGE_KEY = "wholesale-real-estate-crm-v2";

  function persist(nextDeals) {
    setDeals(nextDeals);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextDeals));
  }

  function handleChange(event) {
    const { name, value } = event.target;

    if (name === "closed" && value === "Yes") {
      const isReady =
        form.offerStatus === "Offer Sent" &&
        form.sellerAccepted === "Yes" &&
        form.assigned === "Yes";

      if (!isReady) {
        alert(
          "Cannot close: Offer must be 'Sent', and both 'Accepted' and 'Assigned' must be 'Yes'.",
        );
        return; // Block the change
      }
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function addDeal(event) {
    event.preventDefault();

    // Basic Validation
    if (
      !form.address.trim() ||
      !form.city.trim() ||
      !form.zipCode.trim() ||
      !form.state.trim()
    ) {
      alert("Please fill out the required address fields.");
      return;
    }

    const newDeal = {
      ...form,
      id: crypto.randomUUID(),
      state: form.state.trim().toUpperCase(),
      zipCode: form.zipCode.trim(),
      arv: Number(form.arv || 0),
      rehabCost: Number(form.rehabCost || 0),
      mao: Number(form.mao || 0),
    };

    // Push to end of array to show at the bottom
    persist([...deals, newDeal]);
    setForm(emptyForm);
  }

  function updateDeal(id, field, value) {
    // Business Rule: Enforce the "Closed" requirements even on updates
    if (field === "closed" && value === "Yes") {
      const deal = deals.find((d) => d.id === id);
      const canClose =
        deal.offerStatus === "Offer Sent" &&
        deal.sellerAccepted === "Yes" &&
        deal.assigned === "Yes";

      if (!canClose) {
        alert(
          "Cannot Close: Offer must be 'Sent', and both 'Accepted' and 'Assigned' must be 'Yes'.",
        );
        return;
      }
    }

    const nextDeals = deals.map((deal) =>
      deal.id === id ? { ...deal, [field]: value } : deal,
    );

    persist(nextDeals);
  }

  function deleteDeal(id) {
    const deal = deals.find((item) => item.id === id);
    if (!window.confirm(`Delete ${deal?.address || "this deal"}?`)) return;
    persist(deals.filter((deal) => deal.id !== id));
  }

  const states = useMemo(
    () => [
      "All",
      ...new Set(
        deals
          .map((d) => d.state)
          .filter(Boolean)
          .sort(),
      ),
    ],
    [deals],
  );

  const zipCodes = useMemo(() => {
    const visible =
      filters.state === "All"
        ? deals
        : deals.filter((d) => d.state === filters.state);
    return [
      "All",
      ...new Set(
        visible
          .map((d) => d.zipCode)
          .filter(Boolean)
          .sort(),
      ),
    ];
  }, [deals, filters.state]);

  const filteredDeals = useMemo(() => {
    const query = filters.search.toLowerCase();
    return deals.filter((deal) => {
      const matchesState =
        filters.state === "All" || deal.state === filters.state;
      const matchesZip =
        filters.zipCode === "All" || deal.zipCode === filters.zipCode;
      const matchesStatus =
        filters.offerStatus === "All" ||
        deal.offerStatus === filters.offerStatus;
      const matchesAccepted =
        filters.sellerAccepted === "All" ||
        deal.sellerAccepted === filters.sellerAccepted;
      const matchesAssigned =
        filters.assigned === "All" || deal.assigned === filters.assigned;
      const matchesClosed =
        filters.closed === "All" || deal.closed === filters.closed;
      const matchesSearch =
        !query ||
        [
          deal.address,
          deal.city,
          deal.zipCode,
          deal.state,
          deal.offerStatus,
          deal.notes,
          deal.closed,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);

      return (
        matchesState &&
        matchesZip &&
        matchesStatus &&
        matchesAccepted &&
        matchesAssigned &&
        matchesSearch &&
        matchesClosed
      );
    });
  }, [deals, filters]);

  const currentMonth = new Date().toISOString().slice(0, 7);
  const offersThisMonth = deals.filter(
    (deal) => deal.offerDate && monthKey(deal.offerDate) === currentMonth,
  ).length;
  const acceptedOffers = deals.filter(
    (deal) => deal.sellerAccepted === "Yes",
  ).length;
  const assignedDeals = deals.filter((deal) => deal.assigned === "Yes").length;
  const closedDeals = deals.filter((deal) => deal.closed === "Yes").length;

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <Home size={28} />
          </div>
          <div>
            <strong>PIPELINE</strong>
            <span>Wholesale CRM</span>
          </div>
        </div>
        <nav>
          <a className="active">
            <Home size={18} />
            Dashboard
          </a>
        </nav>
        <div className="user-card">
          <div className="avatar">AJ</div>
          <div>
            <strong>Local CRM</strong>
            <span>Browser storage</span>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="page-header">
          <div>
            <h1 style={{ color: "#1769e8" }}>YOU WIN ESTATES</h1>
            <span>
              Track and manage your wholesale real estate pipeline locally.
            </span>
          </div>
          <button
            className="primary-btn"
            onClick={() =>
              document
                .getElementById("add-property")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <Plus size={18} /> Add Property
          </button>
        </header>

        <section className="stats-grid">
          <Stat
            icon={<ClipboardList />}
            label="Total Deals"
            value={deals.length}
          />
          <Stat icon={<Send />} label="Offers Made" value={offersThisMonth} />
          <Stat
            icon={<CheckCircle2 />}
            label="Accepted"
            value={acceptedOffers}
          />
          <Stat icon={<RefreshCw />} label="Assigned" value={assignedDeals} />
          <Stat icon={<RefreshCw />} label="Closed" value={closedDeals} />
        </section>

        <section className="panel" id="add-property">
          <Wholesale_form
            addDeal={addDeal}
            form={form}
            handleChange={handleChange}
          />
        </section>

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
          <Wholesale_data
            filteredDeals={filteredDeals}
            deals={deals}
            deleteDeal={deleteDeal}
          />
        </section>
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
