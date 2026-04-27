import { Home, Users } from "lucide-react";
import logo from "../assets/logo.png";

function Sidebar({ activeView, setActiveView }) {
  return (
    <aside className="sidebar">
      <div className="brand" style={{ display: 'block', textAlign: 'center', paddingBottom: '20px', borderBottom: '1px solid var(--line)' }}>
        <img src={logo} alt="You Win Estates" style={{ width: '100%', maxWidth: '180px', height: 'auto', display: 'block', margin: '0 auto' }} />
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
