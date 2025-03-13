import React, { useEffect } from "react";

interface ConfirmDeleteModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        onConfirm();
      } else if (event.key === "Escape") {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onConfirm, onCancel]);

  return (
    <>
      <div className="modal-overlay" onClick={onCancel}></div>
      <div className="modal">
        <p>Вы уверены, что хотите удалить?</p>
        <button onClick={onConfirm} className="red-button">
          Да, удалить
        </button>
        <button onClick={onCancel}>Отмена</button>
      </div>
    </>
  );
};

export default ConfirmDeleteModal;
