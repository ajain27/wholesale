import { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  CheckCircle2,
  ClipboardList,
  Home,
  Plus,
  RefreshCw,
  Send,
  Star,
  DollarSign,
  Users,
} from "lucide-react";
import "../css/styles.css";
import { getSavedDeals, monthKey, currency } from "../utils/utils";
import Wholesale_form from "./wholesale_form";
import { Stat } from "./elements";
import Wholesale_data from "./Wholesale_data";
import Wholesale_filters from "./Wholesale_filters";
import Buyers from "./Buyers";

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
  contractPrice: "",
  assigned: "No",
  assignedPrice: "",
  notes: "",
  closed: "No",
};

const STORAGE_KEY = "wholesale-real-estate-crm-v2";

function Wholesale() {
  const [activeView, setActiveView] = useState("dashboard");
  const [deals, setDeals] = useState(getSavedDeals);
  const [form, setForm] = useState(emptyForm);
  const [filters, setFilters] = useState({
    state: "All",
    offerStatus: "All",
    sellerAccepted: "All",
    assigned: "All",
    search: "",
    closed: "All",
  });

  const persist = function persist(nextDeals) {
    setDeals(nextDeals);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextDeals));
  };

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
      contractPrice: Number(form.contractPrice || 0),
      assignedPrice: Number(form.assignedPrice || 0),
    };

    // Push to end of array to show at the bottom
    persist([...deals, newDeal]);
    setForm(emptyForm);
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



  const filteredDeals = useMemo(() => {
    const query = filters.search.toLowerCase();
    return deals.filter((deal) => {
      const matchesState =
        filters.state === "All" || deal.state === filters.state;
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
  
  const totalGrossRevenue = deals
    .filter((deal) => deal.closed === "Yes" && deal.sellerAccepted === "Yes" && deal.assigned === "Yes")
    .reduce((total, deal) => total + (Number(deal.assignedPrice || 0) - Number(deal.contractPrice || 0)), 0);

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
          <a
            className={activeView === "dashboard" ? "active" : ""}
            onClick={() => setActiveView("dashboard")}
            style={{ cursor: "pointer" }}
          >
            <Home size={18} />
            Dashboard
          </a>
          <a
            className={activeView === "buyers" ? "active" : ""}
            onClick={() => setActiveView("buyers")}
            style={{ cursor: "pointer" }}
          >
            <Users size={18} />
            Buyers List
          </a>
        </nav>
        <div className="user-card">
          <div className="avatar">AJ</div>
          <div>
            <strong>Local CRM</strong>
          </div>
        </div>
      </aside>

      <main className="main">
        {activeView === "dashboard" ? (
          <>
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
              <Stat icon={<Star />} label="Closed" value={closedDeals} />
              <Stat icon={<DollarSign />} label="Gross Revenue" value={currency(totalGrossRevenue)} />
            </section>

            <Wholesale_form
              addDeal={addDeal}
              form={form}
              handleChange={handleChange}
            />

            <Wholesale_filters
              filters={filters}
              states={states}
              RefreshCw={RefreshCw}
              setFilters={setFilters}
            />
            <Wholesale_data
              filteredDeals={filteredDeals}
              deals={deals}
              deleteDeal={deleteDeal}
              persist={persist}
            />
          </>
        ) : (
          <Buyers />
        )}
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<Wholesale />);
