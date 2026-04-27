import { Field, Select } from "../elements";

function Wholesale_form({ addDeal, form, handleChange, handleBlur }) {
  return (
    <section className="panel" id="add-property">
      <div>
        <div className="panel-header">
          <div>
            <h2>Add Property Lead</h2>
            <p>
              Once added, records appear as disabled/read-only fields in the
              board.
            </p>
          </div>
        </div>
        <form className="add-form" onSubmit={addDeal}>
          <Field
            label="Property Address"
            name="address"
            value={form.address}
            onChange={handleChange}
            required
          />
          <Field
            label="City"
            name="city"
            value={form.city}
            onChange={handleChange}
            required
          />
          <Field
            label="Zip Code"
            name="zipCode"
            value={form.zipCode}
            onChange={handleChange}
            maxLength="5"
            required
          />
          <Field
            label="State"
            name="state"
            value={form.state}
            onChange={handleChange}
            maxLength="2"
            required
          />
          <Field
            label="ARV"
            name="arv"
            type="text"
            value={form.arv}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          <Field
            label="Rehab Cost"
            name="rehabCost"
            type="text"
            value={form.rehabCost}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          <Field
            label="MAO"
            name="mao"
            type="text"
            value={form.mao}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          <Select
            label="Offer Status"
            name="offerStatus"
            value={form.offerStatus}
            onChange={handleChange}
            options={["Not Sent", "Offer Sent"]}
            required
          />
          <Field
            label="Offer Date"
            name="offerDate"
            type="date"
            value={form.offerDate}
            onChange={handleChange}
            required
          />
          <Select
            label="Accepted"
            name="sellerAccepted"
            value={form.sellerAccepted}
            onChange={handleChange}
            options={["No", "Waiting", "Yes"]}
            required
          />
          <Select
            label="Assigned"
            name="assigned"
            value={form.assigned}
            onChange={handleChange}
            options={["No", "Yes"]}
          />
          <Field
            label="Contract Price"
            name="contractPrice"
            type="text"
            value={form.contractPrice}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          <Field
            label="Assigned Price"
            name="assignedPrice"
            type="text"
            value={form.assignedPrice}
            onChange={handleChange}
            onBlur={handleBlur}
            required={form.assigned === "Yes"}
          />
          {form.assigned === "Yes" && (
            <>
              <Field
                label="Buyer Name / LLC"
                name="buyerName"
                value={form.buyerName || ""}
                onChange={handleChange}
                required
              />
              <Field
                label="Buyer Email"
                name="buyerEmail"
                type="email"
                value={form.buyerEmail || ""}
                onChange={handleChange}
                required
              />
            </>
          )}
          <Field
            label="Notes"
            name="notes"
            value={form.notes}
            onChange={handleChange}
            required
          />
          <Select
            label="Closed"
            name="closed"
            value={form.closed}
            onChange={handleChange}
            options={["No", "Yes"]}
            required
          />
          {form.closed === "Yes" && (
            <Select
              label="Closed In"
              name="closedInMonth"
              value={form.closedInMonth}
              onChange={handleChange}
              options={[
                "",
                "01",
                "02",
                "03",
                "04",
                "05",
                "06",
                "07",
                "08",
                "09",
                "10",
                "11",
                "12",
              ]}
              required
            />
          )}
          <button className="primary-btn form-btn" type="submit">
            Save
          </button>
        </form>
      </div>
    </section>
  );
}

export default Wholesale_form;
