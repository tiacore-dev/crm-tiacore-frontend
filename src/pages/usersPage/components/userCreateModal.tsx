import React, { useEffect, useCallback } from "react";
import { Modal, Input, Button, Form, Select } from "antd"; // Импортируем Form и Select

interface UserCreateModalProps {
  newUserName: string;
  newPassword: string;
  newFullName: string;
  newPosition: string;
  setNewUserName: (value: string) => void;
  setNewPassword: (value: string) => void;
  setNewFullName: (value: string) => void;
  setNewPosition: (value: string) => void;
  onCreate: () => void;
  onCancel: () => void;
  isCreatingLoading: boolean; // Новый пропс для состояния загрузки
}

export const UserCreateModal: React.FC<UserCreateModalProps> = ({
  newUserName,
  newPassword,
  newFullName,
  newPosition,
  setNewUserName,
  setNewPassword,
  setNewFullName,
  setNewPosition,
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

  // Варианты для выпадающего списка "Должность"
  const positionOptions = [
    { value: "admin", label: "Администратор" },
    { value: "manager", label: "Менеджер" },
    { value: "user", label: "Пользователь" },
  ];

  return (
    <Modal
      title="Создание нового пользователя"
      open={true}
      onOk={onCreate}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel} disabled={isCreatingLoading}>
          Отменить
        </Button>,
        <Button
          key="create"
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
          label="Логин пользователя"
          name="username"
          rules={[
            {
              required: true,
              message: "Пожалуйста, введите логин пользователя",
            },
            { min: 3, message: "Минимум 3 символа" },
          ]}
        >
          <Input
            placeholder="Введите логин пользователя"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            disabled={isCreatingLoading}
          />
        </Form.Item>

        {/* Валидация для поля "Пароль" */}
        <Form.Item
          label="Пароль"
          name="password"
          rules={[
            { required: true, message: "Пожалуйста, введите пароль" },
            { min: 6, message: "Минимум 6 символов" },
          ]}
        >
          <Input.Password // Используем Input.Password для скрытия пароля
            placeholder="Введите пароль"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={isCreatingLoading}
          />
        </Form.Item>

        {/* Валидация для поля "Ф.И.О." */}
        <Form.Item
          label="Ф.И.О."
          name="fullName"
          rules={[
            { required: true, message: "Пожалуйста, введите Ф.И.О." },
            { min: 3, message: "Минимум 3 символа" },
          ]}
        >
          <Input
            placeholder="Введите Ф.И.О."
            value={newFullName}
            onChange={(e) => setNewFullName(e.target.value)}
            disabled={isCreatingLoading}
          />
        </Form.Item>

        {/* Валидация для поля "Должность" */}
        <Form.Item
          label="Должность"
          name="position"
          rules={[
            { required: true, message: "Пожалуйста, выберите должность" },
          ]}
        >
          <Select
            placeholder="Выберите должность"
            value={newPosition}
            onChange={(value) => setNewPosition(value)}
            options={positionOptions}
            disabled={isCreatingLoading}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
