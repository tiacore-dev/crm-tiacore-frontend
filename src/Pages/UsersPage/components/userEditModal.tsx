import React, { useEffect } from "react";
import { Modal, Input, Button, Form, Select } from "antd";

interface UserEditModalProps {
  editedData: any; // Данные для редактирования
  onChange: (field: string, value: string) => void; // Функция для обработки изменений
  onSave: () => void; // Функция для сохранения изменений
  onCancel: () => void; // Функция для отмены редактирования
  isUpdateLoading: boolean; // Состояние загрузки
}

export const UserEditModal: React.FC<UserEditModalProps> = ({
  editedData,
  onChange,
  onSave,
  onCancel,
  isUpdateLoading,
}) => {
  const [form] = Form.useForm(); // Хук для управления формой

  // Устанавливаем начальные значения формы при изменении editedData
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
        form.submit(); // Используем form.submit() вместо onSave
      } else if (event.key === "Escape" && !isUpdateLoading) {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onSave, onCancel, isUpdateLoading, form]);

  // Функция, которая вызывается при успешной валидации формы
  const onFinish = () => {
    onSave();
  };

  // Варианты для выпадающего списка "Должность"
  const positionOptions = [
    { value: "admin", label: "Администратор" },
    { value: "manager", label: "Менеджер" },
    { value: "user", label: "Пользователь" },
  ];

  return (
    <Modal
      title="Редактирование пользователя"
      open={true}
      onOk={form.submit} // Используем form.submit() для отправки формы
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel} disabled={isUpdateLoading}>
          Отменить
        </Button>,
        <Button
          key="save"
          type="primary"
          onClick={form.submit} // Используем form.submit() для отправки формы
          loading={isUpdateLoading}
          disabled={isUpdateLoading}
        >
          {isUpdateLoading ? "Сохранение..." : "Сохранить"}
        </Button>,
      ]}
    >
      <Form form={form} onFinish={onFinish}>
        {/* Валидация для поля "Логин" */}
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

        {/* Валидация для поля "Пароль" */}
        <Form.Item
          name="password"
          label="Новый пароль"
          rules={[
            { required: true, message: "Пожалуйста, введите новый пароль" }, // Пароль обязателен
            { min: 6, message: "Пароль должен содержать минимум 6 символов" },
          ]}
        >
          <Input.Password
            placeholder="Введите новый пароль"
            onChange={(e) => onChange("password", e.target.value)}
            disabled={isUpdateLoading}
          />
        </Form.Item>

        {/* Валидация для поля "Ф.И.О." */}
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

        {/* Валидация для поля "Должность" */}
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
