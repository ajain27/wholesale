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

function Field({ label, required, ...props }) {
  return (
    <label className="field">
      <span>{label}{required && <span style={{color: 'var(--red)', marginLeft: '4px'}}>*</span>}</span>
      <input required={required} id={props.id || props.name} {...props} />
    </label>
  );
}

function Select({ label, required, options, ...props }) {
  return (
    <label className="field">
      <span>{label}{required && <span style={{color: 'var(--red)', marginLeft: '4px'}}>*</span>}</span>
      <select required={required} id={props.id || props.name} {...props}>
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
