import React, { useEffect } from "react";
import { Modal, Input, Button, Form } from "antd"; // Импорт компонентов Ant Design

interface ServiceEditModalProps {
  editedData: { service_name: string } | null; // Данные для редактирования
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Функция для обработки изменений
  onSave: () => void; // Функция для сохранения изменений
  onCancel: () => void; // Функция для отмены редактирования
  isUpdateLoading: boolean; // Состояние загрузки
}

export const ServiceEditModal: React.FC<ServiceEditModalProps> = ({
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
        service_name: editedData.service_name,
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

  return (
    <Modal
      title="Редактирование услуги"
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
        <Form.Item
          name="service_name"
          rules={[
            { required: true, message: "Пожалуйста, введите название услуги" },
            {
              min: 3,
              message: "Название услуги должно содержать минимум 3 символа",
            },
          ]}
        >
          <Input
            placeholder="Название услуги"
            name="service_name"
            onChange={onChange}
            disabled={isUpdateLoading}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
