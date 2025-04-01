import React, { useEffect } from "react";
import { Modal, Input, Button, Form } from "antd";

interface CompanyEditModalProps {
  editedData: { company_name: string; description: string };
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onSave: () => void;
  onCancel: () => void;
  isUpdateLoading: boolean;
}

export const CompanyEditModal: React.FC<CompanyEditModalProps> = ({
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
        company_name: editedData.company_name,
        description: editedData.description,
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
  }, [onCancel, isUpdateLoading, form]);

  const onFinish = () => {
    onSave();
  };

  return (
    <Modal
      title="Редактирование"
      open={true}
      onOk={form.submit}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel} disabled={isUpdateLoading}>
          Отменить
        </Button>,
        <Button
          key="save"
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
          name="company_name"
          rules={[
            {
              required: true,
              message: "Пожалуйста, введите название компании",
            },
            {
              min: 3,
              message: "Минимум 3 символа",
            },
          ]}
        >
          <Input
            placeholder="Название компании"
            name="company_name"
            onChange={onChange}
            disabled={isUpdateLoading}
          />
        </Form.Item>

        <Form.Item
          name="description"
          rules={[
            // { required: true, message: "Пожалуйста, введите описание" },
            { min: 3, message: "Минимум 3 символа" },
          ]}
        >
          <Input.TextArea
            placeholder="Описание компании"
            name="description"
            onChange={onChange}
            disabled={isUpdateLoading}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
