function Stat({ icon, label, value, hint }) {
  return (
    <article className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
        {hint && <span>{hint}</span>}
      </div>
    </article>
  );
}

function Field({ label, ...props }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input {...props} />
    </label>
  );
}

function Select({ label, options, ...props }) {
  return (
    <label className="field">
      <span>{label}</span>
      <select {...props}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function ReadOnlyCell({ value, wide, small }) {
  return (
    <td>
      <input
        className={`readonly-input ${wide ? "wide" : ""} ${small ? "small" : ""}`}
        value={value}
        disabled
        readOnly
      />
    </td>
  );
}

function Badge({ value }) {
  const className = String(value || "")
    .toLowerCase()
    .replaceAll(" ", "-");
  return <span className={`badge ${className}`}>{value || "—"}</span>;
}

export { Stat, Badge, ReadOnlyCell, Select, Field };
