import React, { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Modal, Input, Button, Form, Select } from "antd"; // Импортируем Form и Select
import { fetchEntityTypes } from "../../../api/homeApi";
import { ILegalEntityTypesResponse } from "../../../api/homeApi";
import { fetchCompanies } from "../../../api/companiesApi";
import { ILegalEntity } from "../../../api/legalEntitiesApi";

export interface ILegalEntityType {
  legal_entity_type_id: string;
  entity_name: string;
}

export interface ICompany {
  company_id: string;
  company_name: string;
  description: string;
}

export interface ICompaniesResponse {
  total: number;
  companies: ICompany[];
}

export interface LegalEntityCreateModalProps {
  newLegalEntityName: string;
  newINN: string;
  newKPP: string;
  newVatRate: number;
  newAddress: string;
  newEntityType: string;
  newSigner: string;
  newCompany: string;
  newDescription: string;
  setNewLegalEntityName: (value: string) => void;
  setNewINN: (value: string) => void;
  setNewKPP: (value: string) => void;
  setNewVatRate: (value: number) => void;
  setNewAddress: (value: string) => void;
  setNewEntityType: (value: string) => void;
  setNewSigner: (value: string) => void;
  setNewCompany: (value: string) => void;
  setNewDescription: (value: string) => void;

  onCreate: () => void;
  onCancel: () => void;
  isCreatingLoading: boolean; // Новый пропс для состояния загрузки
  title?: string; // Добавляем необязательный пропс для заголовка
}

export const LegalEntityCreateModal: React.FC<LegalEntityCreateModalProps> = ({
  newLegalEntityName,
  newINN,
  newKPP,
  newVatRate,
  newAddress,
  newEntityType,
  newSigner,
  newCompany,
  newDescription,
  setNewLegalEntityName,
  setNewINN,
  setNewKPP,
  setNewVatRate,
  setNewAddress,
  setNewEntityType,
  setNewSigner,
  setNewCompany,
  setNewDescription,
  onCreate,
  onCancel,
  isCreatingLoading,
  title = "Создание", // Значение по умолчанию
}) => {
  const { data: companiesResponse, isLoading: isLoadingCompanies } =
    useQuery<ICompaniesResponse>({
      queryKey: ["companiesForSelection"],
      queryFn: () => fetchCompanies({ page: 1, page_size: 100 }), // Получаем все компании
    });

  const companyOptions = useMemo(() => {
    if (!companiesResponse?.companies) return [];
    return companiesResponse.companies.map((company) => ({
      value: company.company_id,
      label: company.company_name,
    }));
  }, [companiesResponse]);

  const { data: entityTypesResponse, isLoading: isLoadingEntityTypes } =
    useQuery<ILegalEntityTypesResponse>({
      queryKey: ["entityTypes"],
      queryFn: fetchEntityTypes,
    });

  const typeOptions = useMemo(() => {
    if (!entityTypesResponse?.legal_entity_types) return [];
    return entityTypesResponse.legal_entity_types.map((type) => ({
      value: type.legal_entity_type_id,
      label: type.entity_name,
    }));
  }, [entityTypesResponse]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" && !isCreatingLoading) {
        onCreate();
      } else if (event.key === "Escape" && !isCreatingLoading) {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onCreate, onCancel, isCreatingLoading]);

  return (
    <Modal
      title={title}
      open={true}
      onOk={onCreate}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel} disabled={isCreatingLoading}>
          Отменить
        </Button>,
        <Button
          key="create"
          onClick={onCreate}
          loading={isCreatingLoading}
          disabled={isCreatingLoading}
        >
          {isCreatingLoading ? "Создание..." : "Создать"}
        </Button>,
      ]}
    >
      <Form layout="vertical">
        <Form.Item
          name="legal_entity_name"
          label="Название"
          rules={[
            { required: true, message: "Пожалуйста, введите название" },
            { min: 3, message: "Минимум 3 символа" },
          ]}
        >
          <Input
            placeholder="Название"
            onChange={(e) => setNewLegalEntityName(e.target.value)}
            disabled={isCreatingLoading}
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
            placeholder="ИНН"
            onChange={(e) => setNewINN(e.target.value)}
            disabled={isCreatingLoading}
          />
        </Form.Item>
        <Form.Item
          name="kpp"
          label="КПП"
          rules={[
            { required: true, message: "Пожалуйста, введите КПП" },
            { min: 9, message: "Минимум 9 символов" },
            { max: 9, message: "Максимум 9 символов" },
          ]}
        >
          <Input
            placeholder="КПП"
            onChange={(e) => setNewKPP(e.target.value)}
            disabled={isCreatingLoading}
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
            placeholder="Ставка НДС"
            type="number"
            onChange={(e) => setNewVatRate(e.target.valueAsNumber)}
            disabled={isCreatingLoading}
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
            placeholder="Адресс"
            onChange={(e) => setNewAddress(e.target.value)}
            disabled={isCreatingLoading}
          />
        </Form.Item>
        <Form.Item
          name="entity_type"
          label="Тип"
          rules={[{ required: true, message: "Пожалуйста, выберите тип" }]}
        >
          <Select
            placeholder="Выберите тип"
            onChange={(value) => setNewEntityType(value)}
            loading={isLoadingEntityTypes}
            disabled={isCreatingLoading}
            options={typeOptions}
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
          <Input
            placeholder="Подписавший"
            onChange={(e) => setNewSigner(e.target.value)}
            disabled={isCreatingLoading}
          />
        </Form.Item>
        <Form.Item
          name="company"
          label="Компания"
          rules={[{ required: true, message: "Пожалуйста, выберите компанию" }]}
        >
          <Select
            placeholder="Выберите компанию"
            onChange={(value) => setNewCompany(value)}
            loading={isLoadingCompanies}
            disabled={isCreatingLoading}
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
            onChange={(e) => setNewDescription(e.target.value)}
            disabled={isCreatingLoading}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
