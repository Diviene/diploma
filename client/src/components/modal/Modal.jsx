import React from "react";
import "./modal.css";

const Modal = ({ children, isOpen, onClose }) => {
  return (
    <>
      {isOpen && (
        <div className="modal-overlay">
          <div className="modal-content show">
            {children}
            <button onClick={onClose} className="modal-close-button">
              Закрыть
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
