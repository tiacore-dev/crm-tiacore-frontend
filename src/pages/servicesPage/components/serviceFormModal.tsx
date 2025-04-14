import React, { useEffect, useState } from "react";
import { Modal, Input, Button, Form } from "antd";
import { IService } from "../../../api/servicesApi";
import { useServiceMutations } from "../../../hooks/services/useServiceMutations";

interface ServiceCreateModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
  mode?: "create" | "edit";
  initialData?: IService | null;
}

export const ServiceCreateModal: React.FC<ServiceCreateModalProps> = ({
  visible,
  onCancel,
  onSuccess,
  mode = "create",
  initialData = null,
}) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createMutation, updateMutation } = useServiceMutations(
    initialData?.service_id || "",
    initialData?.service_name || ""
  );

  useEffect(() => {
    if (initialData && mode === "edit") {
      form.setFieldsValue({
        service_name: initialData.service_name,
      });
    } else {
      form.resetFields();
    }
  }, [initialData, mode, form]);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const values = await form.validateFields();

      if (mode === "create") {
        await createMutation.mutateAsync(values);
      } else if (mode === "edit" && initialData?.service_id) {
        await updateMutation.mutateAsync(values);
      }

      form.resetFields();
      onCancel();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Validation failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      title={mode === "create" ? "Добавить услугу" : "Редактировать услугу"}
      open={visible}
      onOk={form.submit}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Отмена
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={isSubmitting}
          onClick={handleSubmit}
        >
          {mode === "create" ? "Создать" : "Сохранить"}
        </Button>,
      ]}
      width={700}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Название услуги"
          name="service_name"
          rules={[
            { required: true, message: "Пожалуйста, введите название услуги" },
            {
              min: 3,
              message: "Минимум 3 символа",
            },
          ]}
        >
          <Input placeholder="Введите название услуги" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
