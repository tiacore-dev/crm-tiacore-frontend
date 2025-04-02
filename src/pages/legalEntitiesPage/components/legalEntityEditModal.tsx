import React, { useEffect, useMemo } from "react";
import { Modal, Input, Button, Form, Select } from "antd";
// import { LegalEntityData } from "../legalEntityDetailsPage";
import { useQuery } from "@tanstack/react-query";
import { ICompaniesResponse } from "./legalEntityCreateModal";
import { fetchCompanies } from "../../../api/companiesApi";
import { ILegalEntityTypesResponse } from "../../../api/homeApi";
import { fetchEntityTypes } from "../../../api/homeApi";

interface LegalEntityData {
  legal_entity_id: string;
  legal_entity_name: string;
  inn: string;
  kpp: string;
  vat_rate: number;
  address: string;
  entity_type: string;
  signer: string;
  company: string;
  description: string;
}

interface LegalEntityEditModalProps {
  editedData: LegalEntityData;
  onChange: (field: string, value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  isUpdateLoading: boolean;
}

export const LegalEntityEditModal: React.FC<LegalEntityEditModalProps> = ({
  editedData,
  onChange,
  onSave,
  onCancel,
  isUpdateLoading,
}) => {
  const [form] = Form.useForm();
  const { data: companiesResponse, isLoading: isLoadingCompanies } =
    useQuery<ICompaniesResponse>({
      queryKey: ["companiesForSelection"],
      queryFn: () => fetchCompanies({ page: 1, page_size: 100 }), // Получаем все компании
    });

  useEffect(() => {
    if (editedData) {
      form.setFieldsValue({
        legal_entity_name: editedData.legal_entity_name,
        inn: editedData.inn,
        kpp: editedData.kpp,
        vat_rate: editedData.vat_rate,
        address: editedData.address,
        entity_type: editedData.entity_type,
        signer: editedData.signer,
        company: editedData.company,
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
  }, [onSave, onCancel, isUpdateLoading, form]);

  const onFinish = () => {
    onSave();
  };
  const { data: entityTypesResponse, isLoading: isLoadingEntityTypes } =
    useQuery<ILegalEntityTypesResponse>({
      queryKey: ["entityTypes"],
      queryFn: fetchEntityTypes,
    });

  const companyOptions = useMemo(() => {
    if (!companiesResponse?.companies) return [];
    return companiesResponse.companies.map((company) => ({
      value: company.company_id,
      label: company.company_name,
    }));
  }, [companiesResponse]);

  const typeOptions = useMemo(() => {
    if (!entityTypesResponse?.legal_entity_types) return [];
    return entityTypesResponse.legal_entity_types.map((type) => ({
      value: type.legal_entity_type_id,
      label: type.entity_name,
    }));
  }, [entityTypesResponse]);

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
          name="legal_entity_name"
          label="Название"
          rules={[
            { required: true, message: "Пожалуйста, введите название" },
            { min: 3, message: "Минимум 3 символа" },
          ]}
        >
          <Input
            placeholder="Введите название"
            onChange={(e) => onChange("legal_entity_name", e.target.value)}
            disabled={isUpdateLoading}
          />
        </Form.Item>
        <Form.Item
          name="inn"
          label="ИНН"
          rules={[
            { required: true, message: "Пожалуйста, введите ИНН" },
            { min: 10, message: "Минимум 10 символов" },
          ]}
        >
          <Input
            placeholder="Введите ИНН"
            onChange={(e) => onChange("inn", e.target.value)}
            disabled={isUpdateLoading}
          />
        </Form.Item>
        <Form.Item
          name="kpp"
          label="КПП"
          rules={[
            { required: false, message: "Пожалуйста, введите КПП" },
            { min: 9, message: "Минимум 9 символов" },
            { max: 9, message: "Максимум 9 символов" },
          ]}
        >
          <Input
            placeholder="Введите КПП"
            onChange={(e) => onChange("kpp", e.target.value)}
            disabled={isUpdateLoading}
          />
        </Form.Item>
        <Form.Item
          name="vat_rate"
          label="Ставка НДС"
          rules={[
            { required: true, message: "Пожалуйста, введите ставку НДС" },
          ]}
        >
          <Input
            placeholder="Введите ставку НДС"
            onChange={(e) => onChange("vat_rate", e.target.value)}
            disabled={isUpdateLoading}
          />
        </Form.Item>
        <Form.Item
          name="address"
          label="Адресс"
          rules={[
            { required: true, message: "Пожалуйста, введите адресс" },
            { min: 5, message: "Минимум 5 символов" },
          ]}
        >
          <Input
            placeholder="Введите адресс"
            onChange={(e) => onChange("address", e.target.value)}
            disabled={isUpdateLoading}
          />
        </Form.Item>
        <Form.Item
          name="entity_type"
          label="Тип"
          rules={[{ required: true, message: "Пожалуйста, выберите тип" }]}
        >
          <Select
            placeholder="Выберите тип"
            onChange={(value) => onChange("entity_type", value)}
            loading={isLoadingEntityTypes}
            disabled={isUpdateLoading}
            options={typeOptions}
          />
        </Form.Item>
        <Form.Item
          name="signer"
          label="Подписывающая сторона"
          rules={[
            {
              required: true,
              message: "Пожалуйста, введите кто подписывающая сторона",
            },
            { min: 3, message: "Минимум 3 символа" },
          ]}
        >
          <Input
            placeholder="Введите кто подписывающая сторона"
            onChange={(e) => onChange("signer", e.target.value)}
            disabled={isUpdateLoading}
          />
        </Form.Item>
        <Form.Item
          name="company"
          label="Компания"
          rules={[{ required: true, message: "Пожалуйста, выберите компанию" }]}
        >
          <Select
            placeholder="Выберите компанию"
            onChange={(value) => onChange("company", value)}
            loading={isLoadingCompanies}
            disabled={isUpdateLoading}
            options={companyOptions}
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
          <Input
            placeholder="Введите описание"
            onChange={(e) => onChange("description", e.target.value)}
            disabled={isUpdateLoading}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
