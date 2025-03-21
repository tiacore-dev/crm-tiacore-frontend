import React, { useEffect, useCallback } from "react";
import { Modal, Input, Button, Form, Select } from "antd";
import { UserData } from "../userDetailsPage";

interface UserEditModalProps {
  editedData: UserData;
  onChange: (field: string, value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  isUpdateLoading: boolean;
}

export const UserEditModal: React.FC<UserEditModalProps> = ({
  editedData,
  onChange,
  onSave,
  onCancel,
  isUpdateLoading,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (editedData) {
      form.setFieldsValue({
        username: editedData.username,
        full_name: editedData.full_name,
        position: editedData.position,
      });
    }
  }, [editedData, form]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" && !isUpdateLoading) {
        form.submit();
      } else if (event.key === "Escape" && !isUpdateLoading) {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onSave, onCancel, isUpdateLoading, form]);

  const onFinish = () => {
    onSave();
  };

  const positionOptions = [
    { value: "admin", label: "Администратор" },
    { value: "manager", label: "Менеджер" },
    { value: "user", label: "Пользователь" },
  ];

  return (
    <Modal
      title="Редактирование пользователя"
      open={true}
      onOk={form.submit}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel} disabled={isUpdateLoading}>
          Отменить
        </Button>,
        <Button
          key="save"
          type="primary"
          onClick={form.submit}
          loading={isUpdateLoading}
          disabled={isUpdateLoading}
        >
          {isUpdateLoading ? "Сохранение..." : "Сохранить"}
        </Button>,
      ]}
    >
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          name="username"
          label="Логин"
          rules={[
            { required: true, message: "Пожалуйста, введите логин" },
            { min: 3, message: "Логин должен содержать минимум 3 символа" },
          ]}
        >
          <Input
            placeholder="Введите логин"
            onChange={(e) => onChange("username", e.target.value)}
            disabled={isUpdateLoading}
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="Новый пароль"
          rules={[
            { required: true, message: "Пожалуйста, введите новый пароль" },
            { min: 6, message: "Пароль должен содержать минимум 6 символов" },
          ]}
        >
          <Input.Password
            placeholder="Введите новый пароль"
            onChange={(e) => onChange("password", e.target.value)}
            disabled={isUpdateLoading}
          />
        </Form.Item>

        <Form.Item
          name="full_name"
          label="Ф.И.О."
          rules={[
            { required: true, message: "Пожалуйста, введите Ф.И.О." },
            { min: 3, message: "Ф.И.О. должно содержать минимум 3 символа" },
          ]}
        >
          <Input
            placeholder="Введите Ф.И.О."
            onChange={(e) => onChange("full_name", e.target.value)}
            disabled={isUpdateLoading}
          />
        </Form.Item>

        <Form.Item
          name="position"
          label="Должность"
          rules={[
            { required: true, message: "Пожалуйста, выберите должность" },
          ]}
        >
          <Select
            placeholder="Выберите должность"
            options={positionOptions}
            onChange={(value) => onChange("position", value)}
            disabled={isUpdateLoading}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
