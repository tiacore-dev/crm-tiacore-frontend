import React, { useEffect } from "react";
import { Modal, Input, Button } from "antd"; // Импорт компонентов Ant Design

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
    <Modal
      title="Создание новой услуги"
      open={true}
      onOk={onCreate}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel} disabled={isCreatingLoading}>
          Отменить
        </Button>,
        <Button
          key="create"
          type="primary"
          onClick={onCreate}
          loading={isCreatingLoading}
          disabled={isCreatingLoading}
        >
          {isCreatingLoading ? "Создание..." : "Создать"}
        </Button>,
      ]}
    >
      <Input
        placeholder="Введите название услуги"
        value={newServiceName}
        onChange={(e) => setNewServiceName(e.target.value)}
        disabled={isCreatingLoading}
      />
    </Modal>
  );
};