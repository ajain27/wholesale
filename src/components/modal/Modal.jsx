import React from "react";
import { X } from "lucide-react";

function Modal({ isOpen, onClose, title, children, actions }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="danger-btn modal-close" onClick={onClose}>
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
