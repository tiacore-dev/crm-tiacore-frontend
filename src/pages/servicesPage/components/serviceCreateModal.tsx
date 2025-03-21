import React, { useEffect } from "react";
import { Modal, Input, Button, Form } from "antd"; // Импорт компонентов Ant Design

interface ServiceCreateModalProps {
  newServiceName: string;
  setNewServiceName: (value: string) => void;
  onCreate: () => void;
  onCancel: () => void;
  isCreatingLoading: boolean; // Новый пропс для состояния загрузки
}

export const ServiceCreateModal: React.FC<ServiceCreateModalProps> = ({
  newServiceName,
  setNewServiceName,
  onCreate,
  onCancel,
  isCreatingLoading,
}) => {
  const [form] = Form.useForm(); // Хук для управления формой

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" && !isCreatingLoading) {
        form.submit(); // Используем form.submit() вместо onCreate
      } else if (event.key === "Escape" && !isCreatingLoading) {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onCreate, onCancel, isCreatingLoading, form]);

  // Функция, которая вызывается при успешной валидации формы
  const onFinish = () => {
    onCreate();
  };

  return (
    <Modal
      title="Создание новой услуги"
      open={true}
      onOk={form.submit} // Используем form.submit() для отправки формы
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel} disabled={isCreatingLoading}>
          Отменить
        </Button>,
        <Button
          key="create"
          type="primary"
          onClick={form.submit} // Используем form.submit() для отправки формы
          loading={isCreatingLoading}
          disabled={isCreatingLoading}
        >
          {isCreatingLoading ? "Создание..." : "Создать"}
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
            placeholder="Введите название услуги"
            value={newServiceName}
            onChange={(e) => setNewServiceName(e.target.value)}
            disabled={isCreatingLoading}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
