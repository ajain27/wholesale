import { useMemo, useState, useEffect } from "react";
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
  Moon,
  Sun,
} from "lucide-react";
import "../css/styles.css";
import { getSavedDeals, monthKey, currency } from "../utils/utils";
import Wholesale_form from "./wholesale_form";
import { SimpleStat, GaugeStat } from "./elements";
import Wholesale_data from "./Wholesale_data";
import Wholesale_filters from "./Wholesale_filters";
import Buyers from "./Buyers";
import Sidebar from "./Sidebar";

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
  closedInMonth: "",
};

const STORAGE_KEY = "wholesale-real-estate-crm-v2";

function Wholesale() {
  const [theme, setTheme] = useState(() => localStorage.getItem("crmTheme") || "light");
  const [activeView, setActiveView] = useState("dashboard");

  useEffect(() => {
    localStorage.setItem("crmTheme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);
  const [deals, setDeals] = useState(getSavedDeals);
  const [form, setForm] = useState(emptyForm);
  const [filters, setFilters] = useState({
    state: "All",
    offerStatus: "All",
    sellerAccepted: "All",
    assigned: "All",
    search: "",
    closed: "All",
    offerMonth: "All",
    closedMonth: "All",
    year: "All",
  });

  const persist = function persist(nextDeals) {
    setDeals(nextDeals);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextDeals));
  };

  function handleChange(event) {
    const { name, value } = event.target;

    if (name === "city" && /\d/.test(value)) return;
    if (name === "zipCode" && /[^0-9]/.test(value)) return;
    if (name === "state" && /[^a-zA-Z]/.test(value)) return;

    if (name === "closed" && value === "Yes") {
      const isReady =
        form.sellerAccepted === "Yes" &&
        form.assigned === "Yes";

      if (!isReady) {
        alert(
          "Cannot close: Offer must be 'Accepted', and 'Assigned' must be 'Yes'.",
        );
        return; // Block the change
      }
    }

    const currencyFields = [
      "arv",
      "rehabCost",
      "mao",
      "contractPrice",
      "assignedPrice",
    ];
    if (currencyFields.includes(name)) {
      const cleaned = value.replace(/[^0-9$,]/g, "");
      setForm((prev) => ({ ...prev, [name]: cleaned }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleBlur(event) {
    const { name, value } = event.target;
    const currencyFields = [
      "arv",
      "rehabCost",
      "mao",
      "contractPrice",
      "assignedPrice",
    ];
    if (currencyFields.includes(name) && value) {
      const numericValue = value.replace(/[^0-9]/g, "");
      if (numericValue) {
        const numVal = parseInt(numericValue, 10);

        const parseNumber = (val) => Number(String(val || "0").replace(/[^0-9]/g, ""));
        const currentVals = {
          arv: parseNumber(form.arv),
          rehabCost: parseNumber(form.rehabCost),
          mao: parseNumber(form.mao),
          contractPrice: parseNumber(form.contractPrice),
          assignedPrice: parseNumber(form.assignedPrice),
        };
        currentVals[name] = numVal;

        // Validations
        if (currentVals.arv > 0) {
          if (currentVals.rehabCost > currentVals.arv) {
            alert("Rehab cost cannot be more than ARV.");
            setForm((prev) => ({ ...prev, [name]: "" }));
            return;
          }
          if (currentVals.mao > currentVals.arv) {
            alert("MAO cannot be more than ARV.");
            setForm((prev) => ({ ...prev, [name]: "" }));
            return;
          }
          if (currentVals.contractPrice > currentVals.arv) {
            alert("Contract price cannot be more than ARV.");
            setForm((prev) => ({ ...prev, [name]: "" }));
            return;
          }
        }

        if (currentVals.mao > 0 && currentVals.rehabCost > currentVals.mao) {
          alert("Rehab cost cannot be more than MAO.");
          setForm((prev) => ({ ...prev, [name]: "" }));
          return;
        }

        if (currentVals.contractPrice > 0 && currentVals.assignedPrice > 0 && currentVals.assignedPrice < currentVals.contractPrice) {
          alert("Assigned price needs to be more than or equal to contract price.");
          setForm((prev) => ({ ...prev, [name]: "" }));
          return;
        }

        const formatted =
          "$" + numVal.toLocaleString("en-US");
        setForm((prev) => ({ ...prev, [name]: formatted }));
      }
    }
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

    const parseNumber = (val) => Number(String(val).replace(/[^0-9]/g, ""));
    const arvNum = parseNumber(form.arv);
    const maoNum = parseNumber(form.mao);
    const contractNum = parseNumber(form.contractPrice);
    const assignedNum = parseNumber(form.assignedPrice);
    const rehabNum = parseNumber(form.rehabCost);

    if (arvNum > 0) {
      if (rehabNum > arvNum) { alert("Rehab cost cannot be more than ARV."); return; }
      if (maoNum > arvNum) { alert("MAO cannot be more than ARV."); return; }
      if (contractNum > arvNum) { alert("Contract price cannot be more than ARV."); return; }
    }
    if (maoNum > 0 && rehabNum > maoNum) { alert("Rehab cost cannot be more than MAO."); return; }
    if (contractNum > 0 && assignedNum > 0 && assignedNum < contractNum) { alert("Assigned price needs to be more than or equal to contract price."); return; }

    const newDeal = {
      ...form,
      id: crypto.randomUUID(),
      state: form.state.trim().toUpperCase(),
      zipCode: form.zipCode.trim(),
      arv: parseNumber(form.arv),
      rehabCost: parseNumber(form.rehabCost),
      mao: parseNumber(form.mao),
      contractPrice: parseNumber(form.contractPrice),
      // assignedPrice: parseNumber(form.assignedPrice),
      closedInMonth: form.closedInMonth || "",
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
  const years = useMemo(
    () => [
      "All",
      ...new Set(
        deals
          .map((d) => (d.offerDate ? d.offerDate.substring(0, 4) : null))
          .filter(Boolean)
          .sort()
      ),
    ],
    [deals]
  );

  const months = useMemo(
    () => [
      "All",
      "01", "02", "03", "04", "05", "06",
      "07", "08", "09", "10", "11", "12",
    ],
    []
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

      const dealYear = deal.offerDate ? deal.offerDate.substring(0, 4) : "";
      const matchesYear = filters.year === "All" || dealYear === filters.year;

      const dealOfferMonth = deal.offerDate ? deal.offerDate.substring(5, 7) : "";
      const matchesOfferMonth = filters.offerMonth === "All" || dealOfferMonth === filters.offerMonth;

      const dealClosedMonth = deal.closedInMonth || "";
      const matchesClosedMonth = filters.closedMonth === "All" || dealClosedMonth === filters.closedMonth;

      return (
        matchesState &&
        matchesStatus &&
        matchesAccepted &&
        matchesAssigned &&
        matchesSearch &&
        matchesClosed &&
        matchesYear &&
        matchesOfferMonth &&
        matchesClosedMonth
      );
    });
  }, [deals, filters]);

  const currentMonth = new Date().toISOString().slice(0, 7);
  const offersThisMonth = filteredDeals.filter(
    (deal) => deal.offerDate && monthKey(deal.offerDate) === currentMonth,
  ).length;
  const acceptedOffers = filteredDeals.filter(
    (deal) => deal.sellerAccepted === "Yes",
  ).length;
  const assignedDeals = filteredDeals.filter((deal) => deal.assigned === "Yes").length;
  const closedDeals = filteredDeals.filter((deal) => deal.closed === "Yes").length;
  
  const totalGrossRevenue = filteredDeals
    .filter((deal) => deal.closed === "Yes" && deal.sellerAccepted === "Yes" && deal.assigned === "Yes")
    .reduce((total, deal) => total + (Number(deal.assignedPrice || 0) - Number(deal.contractPrice || 0)), 0);

  const monthNames = {
    "01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr", "05": "May", "06": "Jun",
    "07": "Jul", "08": "Aug", "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dec"
  };
  let revenueLabel = "Total Revenue";
  if (filters.closedMonth !== "All" && filters.year !== "All") {
    revenueLabel = `${monthNames[filters.closedMonth]} ${filters.year} Revenue`;
  } else if (filters.closedMonth !== "All") {
    revenueLabel = `${monthNames[filters.closedMonth]} Revenue`;
  } else if (filters.year !== "All") {
    revenueLabel = `${filters.year} Revenue`;
  }

  return (
    <div className="layout">
      <Sidebar activeView={activeView} setActiveView={setActiveView} theme={theme} setTheme={setTheme} />

      <main className="main">
        {activeView === "dashboard" ? (
          <>
            <header className="page-header">
              <div>
                <h1 style={{ color: theme === "dark" ? "#ffffff" : "#1769e8" }}>Lead Pipeline</h1>
                <span>
                  Track and manage your real estate leads and deals locally.
                </span>
              </div>
              <button 
                className="theme-toggle ghost-btn" 
                style={{ width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0 }}
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                title="Toggle Theme"
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </header>

            <section className="stats-grid">
              <SimpleStat
                icon={<ClipboardList size={20} />}
                label="Total Deals"
                subtitle="All time"
                value={deals.length}
              />
              <GaugeStat 
                label="Offers Made" 
                subtitle="Current month" 
                value={offersThisMonth} 
                max={Math.max(10, offersThisMonth * 2)} 
                colorTheme="orange" 
              />
              <GaugeStat
                label="Accepted"
                subtitle="Current month"
                value={acceptedOffers}
                max={Math.max(5, acceptedOffers * 2)}
                colorTheme="green"
              />
              <GaugeStat 
                label="Assigned" 
                subtitle="All time" 
                value={assignedDeals} 
                max={Math.max(10, deals.length)} 
                colorTheme="orange" 
              />
              <GaugeStat 
                label="Closed" 
                subtitle="All time" 
                value={closedDeals} 
                max={Math.max(10, assignedDeals)} 
                colorTheme="green" 
              />
              <SimpleStat 
                icon={<DollarSign size={20} />} 
                label={revenueLabel} 
                value={currency(totalGrossRevenue)} 
              />
            </section>

            <Wholesale_form
              addDeal={addDeal}
              form={form}
              handleChange={handleChange}
              handleBlur={handleBlur}
            />

            <Wholesale_filters
              filters={filters}
              states={states}
              months={months}
              years={years}
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
          <Buyers theme={theme} setTheme={setTheme} />
        )}
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<Wholesale />);
