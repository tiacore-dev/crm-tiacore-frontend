import React, { useEffect } from "react";
import { Modal, Input, Button } from "antd"; // Импорт компонентов Ant Design

interface EditServiceModalProps {
  editedData: { service_name: string } | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onCancel: () => void;
  isUpdateLoading: boolean;
}

export const EditServiceModal: React.FC<EditServiceModalProps> = ({
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
    <Modal
      title="Редактирование услуги"
      open={true}
      onOk={onSave}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel} disabled={isUpdateLoading}>
          Отменить
        </Button>,
        <Button
          key="save"
          type="primary"
          onClick={onSave}
          loading={isUpdateLoading}
          disabled={isUpdateLoading}
        >
          {isUpdateLoading ? "Сохранение..." : "Сохранить"}
        </Button>,
      ]}
    >
      <Input
        placeholder="Название услуги"
        name="service_name"
        value={editedData?.service_name || ""}
        onChange={onChange}
        disabled={isUpdateLoading}
      />
    </Modal>
  );
};