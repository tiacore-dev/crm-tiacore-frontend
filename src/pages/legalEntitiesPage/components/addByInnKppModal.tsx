import React, { useState } from "react";
import { Modal, Form, Input, Button, message, Select } from "antd";
import { createLegalEntityByInn } from "../../../api/legalEntitiesApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCompaniesForSelection } from "../../../hooks/companies/useCompanyQuery";

interface AddByInnModalProps {
  visible: boolean;
  onCancel: () => void;
  relationType: "buyer" | "seller";
}

export const AddByInnKppModal: React.FC<AddByInnModalProps> = ({
  visible,
  onCancel,
  relationType,
}) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [kppRequired, setKppRequired] = useState(false);
  const isSuperadmin = localStorage.getItem("is_superadmin") === "true";
  const { data: companiesData } = useCompaniesForSelection();
  const companies = companiesData?.companies || [];

  const mutation = useMutation({
    mutationFn: createLegalEntityByInn,
    onSuccess: () => {
      message.success("Контрагент успешно добавлен");
      queryClient.invalidateQueries({
        queryKey:
          relationType === "buyer"
            ? ["legalEntitiesBuyers"]
            : ["legalEntitiesSellers"],
      });
      onCancel();
      form.resetFields();
    },
    onError: () => {
      message.error("Ошибка при добавлении контрагента");
    },
  });

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        let companyId = values.company_id;

        if (!isSuperadmin) {
          companyId = localStorage.getItem("selectedCompanyId");
          if (!companyId) {
            message.error("Не выбрана компания");
            return;
          }
        }

        mutation.mutate({
          ...values,
          company_id: companyId,
          relation_type: relationType,
        });
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  return (
    <Modal
      title={`Добавить ${
        relationType === "buyer" ? "контрагента" : "организацию"
      } по ИНН/КПП`}
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Отмена
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={mutation.isPending}
          onClick={handleSubmit}
        >
          Добавить
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        {isSuperadmin && (
          <Form.Item
            name="company_id"
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

        <Form.Item
          name="inn"
          label="ИНН"
          rules={[
            { required: true, message: "Пожалуйста, введите ИНН" },
            {
              pattern: /^\d+$/,
              message: "ИНН должен содержать только цифры",
            },
            {
              min: 10,
              max: 12,
              message: "ИНН должен быть 10 или 12 цифр",
            },
          ]}
        >
          <Input placeholder="Введите ИНН" />
        </Form.Item>

        <Form.Item
          name="kpp"
          label="КПП"
          rules={[
            {
              pattern: /^\d{9}$/,
              message: "КПП должен содержать 9 цифр",
            },
          ]}
        >
          <Input placeholder="Введите КПП (необязательно)" />
        </Form.Item>

        <Form.Item name="description" label="Описание">
          <Input.TextArea placeholder="Введите описание (необязательно)" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
