import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import Buyers from "./Buyers";

vi.mock("../../firebase/firestoreService", () => ({
  fetchBuyers: vi.fn().mockResolvedValue([]),
  saveBuyer: vi.fn().mockResolvedValue(undefined),
  deleteBuyerById: vi.fn().mockResolvedValue(undefined),
}));

const { fetchBuyers, saveBuyer } =
  await import("../../firebase/firestoreService");

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Buyers component", () => {
  it("renders and loads buyers", async () => {
    fetchBuyers.mockResolvedValue([
      {
        id: "b1",
        fullName: "Jane Doe",
        email: "jane@example.com",
        state: "TX",
      },
    ]);

    render(<Buyers theme="light" setTheme={vi.fn()} />);

    expect(await screen.findByDisplayValue("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("Buyers List")).toBeInTheDocument();
  });

  it("prevents adding a buyer with duplicate email", async () => {
    fetchBuyers.mockResolvedValue([
      {
        id: "b1",
        fullName: "Jane Doe",
        email: "jane@example.com",
        state: "TX",
      },
    ]);

    render(<Buyers theme="light" setTheme={vi.fn()} />);

    await screen.findByDisplayValue("Jane Doe");

    const addBuyerSection = screen.getByText("Add Buyer").closest("section");
    const addBuyerForm = within(addBuyerSection);

    fireEvent.change(addBuyerForm.getByLabelText(/Full Name/i), {
      target: { value: "John Smith" },
    });
    fireEvent.change(addBuyerForm.getByLabelText(/Email/i), {
      target: { value: "jane@example.com" },
    });
    fireEvent.change(addBuyerForm.getByLabelText(/State/i), {
      target: { value: "TX" },
    });

    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

    fireEvent.click(addBuyerForm.getByRole("button", { name: /Save Buyer/i }));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        "A buyer with this email or phone number already exists.",
      );
    });

    alertSpy.mockRestore();
  });
});
