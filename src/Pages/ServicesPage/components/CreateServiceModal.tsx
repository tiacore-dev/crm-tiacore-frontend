import React, { useEffect } from "react";
import "../../../components/Modals/ModalWindow.css";

interface CreateServiceModalProps {
  newServiceName: string;
  setNewServiceName: (value: string) => void;
  onCreate: () => void;
  onCancel: () => void;
  isCreatingLoading: boolean; // Новый пропс для состояния загрузки
}

export const CreateServiceModal: React.FC<CreateServiceModalProps> = ({
  newServiceName,
  setNewServiceName,
  onCreate,
  onCancel,
  isCreatingLoading,
}) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" && !isCreatingLoading) {
        onCreate();
      } else if (event.key === "Escape" && !isCreatingLoading) {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onCreate, onCancel, isCreatingLoading]);

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
          disabled={isCreatingLoading} // Отключаем поле ввода во время загрузки
        />
        <button onClick={onCreate} disabled={isCreatingLoading}>
          {isCreatingLoading ? "Создание..." : "Создать"}
        </button>
        <button
          onClick={onCancel}
          className="red-button"
          disabled={isCreatingLoading}
        >
          Отменить
        </button>
      </div>
    </>
  );
};
