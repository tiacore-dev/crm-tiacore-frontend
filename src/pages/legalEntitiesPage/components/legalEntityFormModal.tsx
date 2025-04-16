import React, { useEffect, useState } from "react";
import { Modal, Input, Button, Form, Select } from "antd"; // Импортируем Form и Select
import { ILegalEntityType } from "../../../api/baseApi";
import { ILegalEntity } from "../../../api/legalEntitiesApi";
import { useLegalEntityMutations } from "../../../hooks/legalEntities/useLegalEntityMutation";

export interface ICompany {
  company_id: string;
  company_name: string;
  description: string;
}

export interface ICompaniesResponse {
  total: number;
  companies: ICompany[];
}

export interface LegalEntityModalProps {
  visible: boolean;
  onCancel: () => void;
  legalEntityTypes: ILegalEntityType[];
  companiesDate: ICompany[];
  onSuccess?: () => void;
  mode?: "create" | "edit";
  initialData?: ILegalEntity | null;
}

export const LegalEntityFormModal: React.FC<LegalEntityModalProps> = ({
  visible,
  onCancel,
  legalEntityTypes,
  companiesDate,
  onSuccess,
  mode = "create",
  initialData = null,
}) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createMutation, updateMutation } = useLegalEntityMutations(
    initialData?.legal_entity_id || "",
    initialData?.legal_entity_name || "",
    initialData?.inn || "",
    initialData?.kpp || "",
    initialData?.vat_rate || 0,
    initialData?.address || "",
    initialData?.entity_type || "",
    initialData?.signer || "",
    initialData?.company || "",
    initialData?.description || ""
  );

  useEffect(() => {
    if (initialData && mode === "edit") {
      form.setFieldsValue({
        legal_entity_name: initialData.legal_entity_name,
        inn: initialData.inn,
        kpp: initialData.kpp,
        address: initialData.address,
        vat_rate: initialData.vat_rate,
        entity_type: initialData.entity_type,
        signer: initialData.signer,
        company: initialData.company,
        description: initialData.description,
      });
    } else {
      form.resetFields();
    }
  }, [initialData, mode, form]);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const values = await form.validateFields();
      const formData = {
        ...values,
      };
      if (mode === "create") {
        await createMutation.mutateAsync(formData);
      } else if (mode === "edit" && initialData?.legal_entity_id) {
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
      title={mode === "create" ? "Добавить юр. лицо" : "Редактировать юр.лицо"}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Отменить
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
          name="legal_entity_name"
          label="Название"
          rules={[
            { required: true, message: "Пожалуйста, введите название" },
            { min: 3, message: "Минимум 3 символа" },
          ]}
        >
          <Input placeholder="Введите название" />
        </Form.Item>
        <Form.Item
          name="inn"
          label="ИНН"
          rules={[
            { required: true, message: "Пожалуйста, введите ИНН" },
            { min: 10, message: "Минимум 10 символов" },
            {
              pattern: /^\d+$/,
              message: "Поле должно содержать только цифры",
            },
          ]}
        >
          <Input placeholder="Введите ИНН" />
        </Form.Item>
        <Form.Item
          name="kpp"
          label="КПП"
          rules={[
            { required: true, message: "Пожалуйста, введите КПП" },
            { min: 9, message: "Минимум 9 символов" },
            { max: 9, message: "Максимум 9 символов" },
            {
              pattern: /^\d+$/,
              message: "Поле должно содержать только цифры",
            },
          ]}
        >
          <Input placeholder="Введите КПП" />
        </Form.Item>
        <Form.Item
          name="vat_rate"
          label="Ставка НДС"
          rules={[
            { required: true, message: "Пожалуйста, введите ставку НДС" },
          ]}
        >
          <Input placeholder="Введите ставку НДС" type="number" />
        </Form.Item>
        <Form.Item
          name="address"
          label="Адрес"
          rules={[
            { required: true, message: "Пожалуйста, введите адрес" },
            { min: 5, message: "Минимум 5 символов" },
          ]}
        >
          <Input placeholder="Введите адрес" />
        </Form.Item>
        <Form.Item
          name="entity_type"
          label="Тип"
          rules={[{ required: true, message: "Пожалуйста, выберите тип" }]}
        >
          <Select
            placeholder="Выберите тип"
            options={legalEntityTypes.map((type) => ({
              value: type.legal_entity_type_id,
              label: type.entity_name,
            }))}
          />
        </Form.Item>
        <Form.Item
          name="signer"
          label="Подписавший"
          rules={[
            {
              required: true,
              message: "Пожалуйста, введите кто подписавший",
            },
            { min: 3, message: "Минимум 3 символа" },
          ]}
        >
          <Input placeholder="Введите подписавшую сторону" />
        </Form.Item>
        <Form.Item
          name="company"
          label="Компания"
          rules={[{ required: true, message: "Пожалуйста, выберите компанию" }]}
        >
          <Select
            placeholder="Выберите компанию"
            options={companiesDate.map((company) => ({
              value: company.company_id,
              label: company.company_name,
            }))}
          />
        </Form.Item>
        <Form.Item
          name="description"
          label="Описание"
          rules={[
            { required: false },
            { min: 3, message: "Минимум 3 символа" },
          ]}
        >
          <Input placeholder="Введите описание (необязательно)" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
