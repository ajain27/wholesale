import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Wholesale_data from "./Wholesale_data";

const deal = {
  id: "d1",
  address: "123 Main St",
  city: "Austin",
  zipCode: "78701",
  state: "TX",
  arv: 450000,
  rehabCost: 45000,
  mao: 275000,
  offerStatus: "Not Sent",
  offerDate: "",
  sellerAccepted: "No",
  assigned: "No",
  contractPrice: 0,
  assignedPrice: 0,
  buyerName: "",
  buyerEmail: "",
  notes: "",
  closed: "No",
  closedInMonth: "",
};

describe("Wholesale_data", () => {
  it("calls saveDeal when offer status changes", async () => {
    const saveDeal = vi.fn().mockResolvedValue(undefined);
    const persist = vi.fn();

    render(
      <Wholesale_data
        filteredDeals={[deal]}
        deals={[deal]}
        deleteDeal={vi.fn()}
        persist={persist}
        saveDeal={saveDeal}
      />,
    );

    const select = screen.getByDisplayValue("Not Sent");
    fireEvent.change(select, { target: { value: "Offer Sent" } });

    await waitFor(() => {
      expect(saveDeal).toHaveBeenCalledWith({
        ...deal,
        offerStatus: "Offer Sent",
      });
    });
    expect(persist).toHaveBeenCalled();
  });
});
