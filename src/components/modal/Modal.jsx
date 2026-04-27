import React from "react";
import { X } from "lucide-react";

function Modal({ isOpen, onClose, title, children, actions }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <h2 style={{ marginBottom: 0 }}>{title}</h2>
          <button
            className="danger-btn"
            onClick={onClose}
            style={{
              background: "transparent",
              color: "var(--muted)",
              padding: "4px",
            }}
          >
            <X size={20} />
          </button>
        </div>
        {children}
        {actions && <div className="modal-actions">{actions}</div>}
      </div>
    </div>
  );
}

export default Modal;
