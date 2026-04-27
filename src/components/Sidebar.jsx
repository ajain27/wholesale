import { Home, Users } from "lucide-react";

function Sidebar({ activeView, setActiveView }) {
  return (
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
  );
}

export default Sidebar;
