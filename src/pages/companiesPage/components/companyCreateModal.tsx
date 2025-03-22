import React, { useEffect, useCallback } from "react";
import { Modal, Input, Button, Form, Select } from "antd"; // Импортируем Form и Select

interface CompanyCreateModalProps {
  newCompanyName: string;
  newDescription: string;
  setNewCompanyName: (value: string) => void;
  setNewDescription: (value: string) => void;
  onCreate: () => void;
  onCancel: () => void;
  isCreatingLoading: boolean; // Новый пропс для состояния загрузки
}

export const CompanyCreateModal: React.FC<CompanyCreateModalProps> = ({
  newCompanyName,
  newDescription,
  setNewCompanyName,
  setNewDescription,
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
      title="Создание новой компании"
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
      <Form layout="vertical">
        {/* Валидация для поля "Логин" */}
        <Form.Item
          label="Название компании"
          name="company_name"
          rules={[
            {
              required: true,
              message: "Пожалуйста, введите название компании",
            },
            { min: 3, message: "Название должно содержать минимум 3 символа" },
          ]}
        >
          <Input
            placeholder="Введите название компании"
            value={newCompanyName}
            onChange={(e) => setNewCompanyName(e.target.value)}
            disabled={isCreatingLoading}
          />
        </Form.Item>

        {/* Валидация для поля "Ф.И.О." */}
        <Form.Item
          label="Описание"
          name="description"
          rules={[
            { min: 3, message: "Описание должно содержать минимум 3 символа" },
          ]}
        >
          <Input
            placeholder="Введите описание"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            disabled={isCreatingLoading}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
