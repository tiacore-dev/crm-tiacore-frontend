import React, { useEffect, useState } from "react";
import { Modal, Input, Button, Form, Select } from "antd";
import { IService } from "../../../api/servicesApi";
import { useServiceMutations } from "../../../hooks/services/useServiceMutations";
import { useCompanyQuery } from "../../../hooks/companies/useCompanyQuery";

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
  const { data: companiesData } = useCompanyQuery();
  const selectedCompanyId = localStorage.getItem("selectedCompanyId");

  const { createMutation, updateMutation } = useServiceMutations(
    initialData?.service_id || "",
    initialData?.service_name || "",
    initialData?.company || ""
  );

  useEffect(() => {
    if (visible) {
      if (initialData && mode === "edit") {
        form.setFieldsValue({
          service_name: initialData.service_name,
          company: initialData.company,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, initialData, mode, form]);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const values = await form.validateFields();

      // Добавляем company в данные при создании, если его нет
      const formData =
        mode === "create"
          ? {
              ...values,
              company: selectedCompanyId || values.company,
            }
          : values;

      if (mode === "create") {
        await createMutation.mutateAsync(formData);
      } else if (mode === "edit" && initialData?.service_id) {
        await updateMutation.mutateAsync(formData);
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
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Название услуги"
          name="service_name"
          rules={[
            { required: true, message: "Пожалуйста, введите название услуги" },
            { min: 3, message: "Минимум 3 символа" },
          ]}
        >
          <Input placeholder="Введите название услуги" />
        </Form.Item>

        {mode === "create" && (
          <Form.Item
            label="Компания"
            name="company"
            rules={[
              { required: true, message: "Пожалуйста, выберите компанию" },
            ]}
          >
            <Select
              placeholder="Выберите компанию"
              options={companiesData?.companies.map((company) => ({
                value: company.company_id,
                label: company.company_name,
              }))}
            />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};
