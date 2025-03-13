import React, { useEffect } from "react";

interface EditServiceModalProps {
  editedData: { service_name: string } | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onCancel: () => void;
}

const EditServiceModal: React.FC<EditServiceModalProps> = ({
  editedData,
  onChange,
  onSave,
  onCancel,
}) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        onSave();
      } else if (event.key === "Escape") {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onSave, onCancel]);

  return (
    <>
      <div className="modal-overlay" onClick={onCancel}></div>
      <div className="modal">
        <h3>Редактирование услуги</h3>
        <label>
          Название услуги:
          <input
            type="text"
            name="service_name"
            value={editedData?.service_name || ""}
            onChange={onChange}
          />
        </label>
        <div>
          <button onClick={onSave}>Сохранить</button>
          <button onClick={onCancel} className="red-button">
            Отменить
          </button>
        </div>
      </div>
    </>
  );
};

export default EditServiceModal;
