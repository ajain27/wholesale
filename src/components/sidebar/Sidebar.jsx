import { Home, Users } from "lucide-react";
import logo from "../../assets/logo.png";

function Sidebar({ activeView, setActiveView, theme }) {
  return (
    <aside className="sidebar">
      <div className="brand sidebar-brand">
        <img src={logo} alt="You Win Estates" className="brand-logo" />
      </div>
      <nav>
        <a
          className={activeView === "dashboard" ? "active" : ""}
          onClick={() => setActiveView("dashboard")}
        >
          <Home size={18} />
          Dashboard
        </a>
        <a
          className={activeView === "buyers" ? "active" : ""}
          onClick={() => setActiveView("buyers")}
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
