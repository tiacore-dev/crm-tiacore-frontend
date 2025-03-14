import React, { useEffect } from "react";

interface ConfirmDeleteModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  isDeleteLoading: boolean;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  onConfirm,
  onCancel,
  isDeleteLoading,
}) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" && !isDeleteLoading) {
        onConfirm();
      } else if (event.key === "Escape" && !isDeleteLoading) {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onConfirm, onCancel, isDeleteLoading]);

  return (
    <>
      <div className="modal-overlay" onClick={onCancel}></div>
      <div className="modal">
        <p>Вы уверены, что хотите удалить?</p>
        <button
          onClick={onConfirm}
          className="red-button"
          disabled={isDeleteLoading}
        >
          {isDeleteLoading ? "Удаление..." : "Удалить"}
        </button>
        <button onClick={onCancel} disabled={isDeleteLoading}>
          Отмена
        </button>
      </div>
    </>
  );
};

export default ConfirmDeleteModal;
