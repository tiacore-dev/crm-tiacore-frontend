import React, { useEffect } from "react";

interface EditServiceModalProps {
  editedData: { service_name: string } | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onCancel: () => void;
  isUpdateLoading: boolean;
}

const EditServiceModal: React.FC<EditServiceModalProps> = ({
  editedData,
  onChange,
  onSave,
  onCancel,
  isUpdateLoading,
}) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" && !isUpdateLoading) {
        onSave();
      } else if (event.key === "Escape" && !isUpdateLoading) {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onSave, onCancel, isUpdateLoading]);

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
            disabled={isUpdateLoading}
          />
        </label>
        <div>
          <button onClick={onSave} disabled={isUpdateLoading}>
            {isUpdateLoading ? "Сохранение..." : "Сохранить"}
          </button>
          <button
            onClick={onCancel}
            className="red-button"
            disabled={isUpdateLoading}
          >
            Отменить
          </button>
        </div>
      </div>
    </>
  );
};

export default EditServiceModal;
