import React, { useEffect } from "react";

interface CreateServiceModalProps {
  newServiceName: string;
  setNewServiceName: (value: string) => void;
  onCreate: () => void;
  onCancel: () => void;
}

const CreateServiceModal: React.FC<CreateServiceModalProps> = ({
  newServiceName,
  setNewServiceName,
  onCreate,
  onCancel,
}) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        onCreate();
      } else if (event.key === "Escape") {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onCreate, onCancel]);

  return (
    <>
      <div className="modal-overlay" onClick={onCancel}></div>
      <div className="modal">
        <h3>Создание новой услуги</h3>
        <input
          type="text"
          placeholder="Введите название услуги"
          value={newServiceName}
          onChange={(e) => setNewServiceName(e.target.value)}
        />
        <button onClick={onCreate}>Создать</button>
        <button onClick={onCancel} className="red-button">
          Отменить
        </button>
      </div>
    </>
  );
};

export default CreateServiceModal;
