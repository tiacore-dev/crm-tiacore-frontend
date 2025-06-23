import React, { useEffect, useState } from "react";
import { Modal, Input, Button, Form, Select } from "antd";
import { IService } from "../../../api/servicesApi";
import { useServiceMutations } from "../../../hooks/services/useServiceMutations";
import { useCompaniesForSelection } from "../../../hooks/companies/useCompanyQuery";

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
  const selectedCompanyId = localStorage.getItem("selectedCompanyId");
  const { data: companiesData } = useCompaniesForSelection();
  const companies = companiesData?.companies || [];
  const isSuperadmin = localStorage.getItem("is_superadmin") === "true";

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
        // Устанавливаем company из localStorage при создании (для не-суперадминов)
        form.setFieldsValue({
          service_name: "",
          company: isSuperadmin ? undefined : selectedCompanyId,
        });
      }
    }
  }, [visible, initialData, mode, form, selectedCompanyId, isSuperadmin]);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const values = await form.validateFields();

      // Для суперадмина берем company из формы, для остальных - из localStorage
      const formData = {
        service_name: values.service_name,
        company: isSuperadmin ? values.company : selectedCompanyId,
      };

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

        {isSuperadmin && (
          <Form.Item
            name="company"
            label="Компания"
            rules={[
              { required: true, message: "Пожалуйста, выберите компанию" },
            ]}
          >
            <Select placeholder="Выберите компанию">
              {companies.map((company) => (
                <Select.Option
                  key={company.company_id}
                  value={company.company_id}
                >
                  {company.company_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};
