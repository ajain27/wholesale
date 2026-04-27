import { useMemo, useState } from "react";
import { RefreshCw, Plus, Users, Sun, Moon } from "lucide-react";
import { getSavedBuyers, BUYERS_STORAGE_KEY } from "../utils/utils";
import BuyerForm from "./BuyerForm";
import BuyerFilters from "./BuyerFilters";
import BuyerData from "./BuyerData";
import { SimpleStat } from "./elements";

const emptyBuyerForm = {
  fullName: "",
  email: "",
  phone: "",
  city: "",
  state: "",
  realEstateType: "Single Family",
};

function Buyers({ theme, setTheme }) {
  const [buyers, setBuyers] = useState(getSavedBuyers);
  const [form, setForm] = useState(emptyBuyerForm);
  const [filters, setFilters] = useState({
    state: "All",
    realEstateType: "All",
    search: "",
  });

  const persist = function persist(nextBuyers) {
    setBuyers(nextBuyers);
    localStorage.setItem(BUYERS_STORAGE_KEY, JSON.stringify(nextBuyers));
  };

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function addBuyer(event) {
    event.preventDefault();

    if (!form.fullName?.trim() || !form.email?.trim() || !form.state?.trim()) {
      alert("Please fill out at least Full Name, Email, and State.");
      return;
    }

    const newEmail = form.email.trim().toLowerCase();
    const newPhone = form.phone?.trim();

    const isDuplicate = buyers.some((buyer) => {
      const emailMatch = buyer.email?.toLowerCase() === newEmail;
      const phoneMatch = newPhone && buyer.phone === newPhone;
      return emailMatch || phoneMatch;
    });

    if (isDuplicate) {
      alert("A buyer with this email or phone number already exists.");
      return;
    }

    const newBuyer = {
      ...form,
      id: crypto.randomUUID(),
      state: form.state?.trim().toUpperCase() || "",
    };

    persist([...buyers, newBuyer]);
    setForm(emptyBuyerForm);
  }

  function deleteBuyer(id) {
    const buyer = buyers.find((item) => item.id === id);
    if (!window.confirm(`Delete ${buyer?.fullName || "this buyer"}?`)) return;
    persist(buyers.filter((b) => b.id !== id));
  }

  const states = useMemo(
    () => [
      "All",
      ...new Set(
        buyers
          .map((b) => b.state)
          .filter(Boolean)
          .sort(),
      ),
    ],
    [buyers],
  );

  const types = useMemo(
    () => [
      "All",
      "Single Family",
      "Multi Family",
      "Commercial",
      "Land",
      "Other",
    ],
    [],
  );

  const filteredBuyers = useMemo(() => {
    const query = filters.search.toLowerCase();
    return buyers.filter((buyer) => {
      const matchesState =
        filters.state === "All" || buyer.state === filters.state;
      const matchesType =
        filters.realEstateType === "All" ||
        buyer.realEstateType === filters.realEstateType;
      const matchesSearch =
        !query ||
        [buyer.fullName, buyer.email, buyer.phone, buyer.city]
          .join(" ")
          .toLowerCase()
          .includes(query);

      return matchesState && matchesType && matchesSearch;
    });
  }, [buyers, filters]);

  return (
    <>
      <header className="page-header">
        <div>
          <h1 style={{ color: theme === "dark" ? "#ffffff" : "#1769e8" }}>
            Buyers List
          </h1>
          <span>
            Manage your network of cash buyers and real estate investors.
          </span>
        </div>
        <button
          className="theme-toggle ghost-btn"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            flexShrink: 0,
          }}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          title="Toggle Theme"
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>

      <section className="stats-grid">
        <SimpleStat
          icon={<Users size={20} />}
          label={
            filters.state === "All"
              ? "Total Buyers"
              : `Buyers in ${filters.state}`
          }
          value={filteredBuyers.length}
        />
      </section>

      <BuyerForm addBuyer={addBuyer} form={form} handleChange={handleChange} />

      <BuyerFilters
        filters={filters}
        states={states}
        types={types}
        RefreshCw={RefreshCw}
        setFilters={setFilters}
      />

      <BuyerData
        filteredBuyers={filteredBuyers}
        buyers={buyers}
        deleteBuyer={deleteBuyer}
        persist={persist}
      />
    </>
  );
}

export default Buyers;
