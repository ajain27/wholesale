import { SimpleStat, GaugeStat } from "../elements";
import { ClipboardList, DollarSign } from "lucide-react";
import { currency, monthKey } from "../../utils/utils";

export default function StatsGrid({ deals, filteredDeals, filters }) {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const offersThisMonth = filteredDeals.filter(
    (deal) => deal.offerDate && monthKey(deal.offerDate) === currentMonth,
  ).length;
  const acceptedOffers = filteredDeals.filter(
    (deal) => deal.sellerAccepted === "Yes",
  ).length;
  const assignedDeals = filteredDeals.filter(
    (deal) => deal.assigned === "Yes",
  ).length;
  const closedDeals = filteredDeals.filter(
    (deal) => deal.closed === "Yes",
  ).length;
  const activeDeals = filteredDeals.filter(
    (deal) => deal.closed !== "Yes",
  ).length;

  const totalGrossRevenue = filteredDeals
    .filter(
      (deal) =>
        deal.closed === "Yes" &&
        deal.sellerAccepted === "Yes" &&
        deal.assigned === "Yes",
    )
    .reduce(
      (total, deal) =>
        total +
        (Number(deal.assignedPrice || 0) - Number(deal.contractPrice || 0)),
      0,
    );

  const monthNames = {
    "01": "Jan",
    "02": "Feb",
    "03": "Mar",
    "04": "Apr",
    "05": "May",
    "06": "Jun",
    "07": "Jul",
    "08": "Aug",
    "09": "Sep",
    10: "Oct",
    11: "Nov",
    12: "Dec",
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
        colorTheme="green"
      />
      <GaugeStat
        label="Active Deals"
        // subtitle="Current month"
        value={activeDeals}
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
  );
}
