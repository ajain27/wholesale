import { Home, Users, Moon, Sun } from "lucide-react";
import logo from "../assets/logo.png";

function Sidebar({ activeView, setActiveView, theme, setTheme }) {
  return (
    <aside className="sidebar">
      <div
        className="brand"
        style={{
          display: "flex",
          justifyContent: "center",
          borderBottom: "1px solid var(--line)",
          paddingBottom: "20px",
        }}
      >
        <img
          src={logo}
          alt="You Win Estates"
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            opacity: 0.95,
            mixBlendMode: theme === "dark" ? "screen" : "multiply",
            filter: theme === "dark" ? "invert(1) hue-rotate(180deg)" : "none",
          }}
        />
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
      <div className="user-card" style={{ marginTop: "auto" }}>
        <div className="avatar">AJ</div>
        <div>
          <strong>Local CRM</strong>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
