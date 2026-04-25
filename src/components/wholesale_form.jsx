import { Field, Select } from "./elements";

function Wholesale_form({ addDeal, form, handleChange }) {
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
          />
          <Field
            label="City"
            name="city"
            value={form.city}
            onChange={handleChange}
          />
          <Field
            label="Zip Code"
            name="zipCode"
            value={form.zipCode}
            onChange={handleChange}
          />
          <Field
            label="State"
            name="state"
            value={form.state}
            onChange={handleChange}
            maxLength="2"
          />
          <Field
            label="ARV"
            name="arv"
            type="number"
            value={form.arv}
            onChange={handleChange}
          />
          <Field
            label="Rehab Cost"
            name="rehabCost"
            type="number"
            value={form.rehabCost}
            onChange={handleChange}
          />
          <Field
            label="MAO"
            name="mao"
            type="number"
            value={form.mao}
            onChange={handleChange}
          />
          <Select
            label="Offer Status"
            name="offerStatus"
            value={form.offerStatus}
            onChange={handleChange}
            options={[
              "Not Sent",
              "Offer Sent",
              "Under Review",
              "Rejected",
              "Accepted",
              "Closed",
            ]}
          />
          <Field
            label="Offer Date"
            name="offerDate"
            type="date"
            value={form.offerDate}
            onChange={handleChange}
          />
          <Select
            label="Accepted"
            name="sellerAccepted"
            value={form.sellerAccepted}
            onChange={handleChange}
            options={["No", "Maybe", "Yes"]}
          />
          <Select
            label="Assigned"
            name="assigned"
            value={form.assigned}
            onChange={handleChange}
            options={["No", "Yes"]}
          />
          <Field
            label="Notes"
            name="notes"
            value={form.notes}
            onChange={handleChange}
          />
          <Select
            label="Closed"
            name="closed"
            value={form.closed}
            onChange={handleChange}
            options={["No", "Yes"]}
          />
          <button className="primary-btn form-btn" type="submit">
            Save
          </button>
        </form>
      </div>
    </section>
  );
}

export default Wholesale_form;
